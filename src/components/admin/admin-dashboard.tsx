'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, ShoppingBag, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { usePageStore } from '@/stores';

interface DashboardData {
  totalProducts: number;
  totalOrders: number;
  totalCategories: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  recentOrders: RecentOrder[];
  lowStockProducts: LowStockProduct[];
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  status: string;
  total: number;
  createdAt: string;
  items: { id: string; productName: string; quantity: number }[];
}

interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
  unit: string;
  sku?: string;
}

const statusColorMap: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { setAdminPage } = usePageStore();

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // Silently fail on dashboard load
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const stats = [
    {
      title: 'Total Products',
      value: data?.totalProducts ?? 0,
      icon: <Package className="h-5 w-5" />,
      description: `${data?.totalCategories ?? 0} categories`,
    },
    {
      title: 'Total Orders',
      value: data?.totalOrders ?? 0,
      icon: <ShoppingBag className="h-5 w-5" />,
      description: `${data?.completedOrders ?? 0} completed`,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data?.totalRevenue ?? 0),
      icon: <DollarSign className="h-5 w-5" />,
      description: 'From completed orders',
      isText: true,
    },
    {
      title: 'Pending Orders',
      value: data?.pendingOrders ?? 0,
      icon: <Clock className="h-5 w-5" />,
      description: 'Awaiting processing',
      highlight: (data?.pendingOrders ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p
                        className={`text-2xl font-bold ${
                          stat.highlight ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                        } ${stat.isText ? 'text-xl' : ''}`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                        stat.highlight
                          ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
            <button
              onClick={() => setAdminPage('orders')}
              className="text-sm text-primary hover:underline font-medium"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order #</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">Items</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-sm">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="text-sm">{order.customerName}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusColorMap[order.status] ?? 'bg-muted text-muted-foreground'}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-sm">
                          {formatCurrency(order.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <ShoppingBag className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-semibold">Low Stock Alerts</CardTitle>
            {data?.lowStockProducts && data.lowStockProducts.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {data.lowStockProducts.length}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-12 rounded" />
                  </div>
                ))}
              </div>
            ) : data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-3">
                {data.lowStockProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setAdminPage('products')}
                    className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      {product.sku && (
                        <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                      )}
                    </div>
                    <div className="ml-3 shrink-0">
                      <Badge
                        variant="destructive"
                        className="text-xs font-semibold"
                      >
                        {product.stock} {product.unit}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Package className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-sm">All products in stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}