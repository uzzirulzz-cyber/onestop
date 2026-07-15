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
import { Package, ShoppingBag, DollarSign, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
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
  pending: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/15',
  processing: 'bg-blue-500/10 text-blue-400 border border-blue-500/15',
  completed: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15',
  cancelled: 'bg-red-500/10 text-red-400 border border-red-500/15',
  delivered: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15',
};

function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString()}`;
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
      gradient: 'from-[#0057D9]/20 to-[#0057D9]/5',
      iconColor: 'text-[#3A8DFF]',
      borderColor: 'border-[#0057D9]/15',
    },
    {
      title: 'Total Orders',
      value: data?.totalOrders ?? 0,
      icon: <ShoppingBag className="h-5 w-5" />,
      description: `${data?.completedOrders ?? 0} completed`,
      gradient: 'from-[#10B981]/20 to-[#10B981]/5',
      iconColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/15',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(data?.totalRevenue ?? 0),
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'From completed orders',
      gradient: 'from-[#F5B400]/20 to-[#F5B400]/5',
      iconColor: 'text-[#F5B400]',
      borderColor: 'border-[#F5B400]/15',
      isText: true,
    },
    {
      title: 'Pending Orders',
      value: data?.pendingOrders ?? 0,
      icon: <Clock className="h-5 w-5" />,
      description: 'Awaiting processing',
      highlight: (data?.pendingOrders ?? 0) > 0,
      gradient: (data?.pendingOrders ?? 0) > 0 ? 'from-yellow-500/20 to-yellow-500/5' : 'from-white/[0.04] to-white/[0.01]',
      iconColor: (data?.pendingOrders ?? 0) > 0 ? 'text-yellow-400' : 'text-white/40',
      borderColor: (data?.pendingOrders ?? 0) > 0 ? 'border-yellow-500/15' : 'border-white/[0.06]',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="border-white/[0.06] bg-white/[0.02]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24 bg-white/[0.04]" />
                      <Skeleton className="h-8 w-16 bg-white/[0.04]" />
                      <Skeleton className="h-3 w-32 bg-white/[0.04]" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-xl bg-white/[0.04]" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <Card key={stat.title} className={`admin-card border ${stat.borderColor} bg-gradient-to-br ${stat.gradient}`}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1.5">
                      <p className="text-[12px] font-medium text-white/35 uppercase tracking-wider">{stat.title}</p>
                      <p
                        className={`text-2xl font-bold text-white ${stat.isText ? 'text-xl' : ''}`}
                      >
                        {stat.value}
                      </p>
                      <p className="text-[11px] text-white/25">{stat.description}</p>
                    </div>
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] ${stat.iconColor}`}
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
        <Card className="lg:col-span-2 admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-[14px] font-semibold text-white/80">Recent Orders</CardTitle>
            <button
              onClick={() => setAdminPage('orders')}
              className="text-[12px] text-[#3A8DFF] hover:text-[#5AA0FF] font-medium transition-colors"
            >
              View all
            </button>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full bg-white/[0.03]" />
                ))}
              </div>
            ) : data?.recentOrders && data.recentOrders.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="text-white/30 text-[12px]">Order #</TableHead>
                      <TableHead className="text-white/30 text-[12px]">Customer</TableHead>
                      <TableHead className="hidden sm:table-cell text-white/30 text-[12px]">Items</TableHead>
                      <TableHead className="text-white/30 text-[12px]">Status</TableHead>
                      <TableHead className="text-right text-white/30 text-[12px]">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow key={order.id} className="border-white/[0.04] hover:bg-white/[0.02]">
                        <TableCell className="font-medium text-[13px] text-[#3A8DFF]">
                          {order.orderNumber}
                        </TableCell>
                        <TableCell className="text-[13px] text-white/70">{order.customerName}</TableCell>
                        <TableCell className="hidden sm:table-cell text-[12px] text-white/30">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`text-[11px] font-medium ${statusColorMap[order.status] ?? ''}`}
                          >
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium text-[13px] text-white/80">
                          {formatCurrency(order.total)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-white/20">
                <ShoppingBag className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-[13px]">No orders yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card className="admin-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-[14px] font-semibold text-white/80">Low Stock Alerts</CardTitle>
            {data?.lowStockProducts && data.lowStockProducts.length > 0 && (
              <Badge variant="destructive" className="text-[10px] bg-red-500/15 text-red-400 border border-red-500/20">
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
                    <Skeleton className="h-4 w-32 bg-white/[0.03]" />
                    <Skeleton className="h-5 w-12 rounded-lg bg-white/[0.03]" />
                  </div>
                ))}
              </div>
            ) : data?.lowStockProducts && data.lowStockProducts.length > 0 ? (
              <div className="max-h-96 overflow-y-auto custom-scrollbar space-y-2">
                {data.lowStockProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setAdminPage('products')}
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.05] p-3 text-left transition-all hover:bg-white/[0.03] hover:border-white/[0.08]"
                  >
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-white/80 truncate">{product.name}</p>
                      {product.sku && (
                        <p className="text-[11px] text-white/25 font-mono">SKU: {product.sku}</p>
                      )}
                    </div>
                    <div className="ml-3 shrink-0">
                      <Badge
                        variant="destructive"
                        className="text-[11px] font-semibold bg-red-500/10 text-red-400 border border-red-500/15"
                      >
                        {product.stock} {product.unit}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-white/20">
                <Package className="h-10 w-10 mb-3 opacity-40" />
                <p className="text-[13px]">All products in stock</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}