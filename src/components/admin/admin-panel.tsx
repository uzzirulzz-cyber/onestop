'use client';

import { usePageStore, type AdminPage } from '@/stores';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useViewStore } from '@/stores';
import { useState } from 'react';
import { AdminDashboard } from './admin-dashboard';
import { AdminProducts } from './admin-products';
import { AdminOrders } from './admin-orders';
import { AdminCategories } from './admin-categories';
import { cn } from '@/lib/utils';

interface NavItem {
  id: AdminPage;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'products', label: 'Products', icon: <Package className="h-5 w-5" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingBag className="h-5 w-5" /> },
  { id: 'categories', label: 'Categories', icon: <Tags className="h-5 w-5" /> },
];

export function AdminPanel() {
  const { adminPage, setAdminPage } = usePageStore();
  const { setView } = useViewStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderContent = () => {
    switch (adminPage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'categories':
        return <AdminCategories />;
      default:
        return <AdminDashboard />;
    }
  };

  const handleNavClick = (page: AdminPage) => {
    setAdminPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - hidden on mobile unless toggled, icon-only on tablet, full on desktop */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 md:relative md:z-auto',
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16 lg:w-64'
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              O
            </div>
            <span className="hidden lg:block text-base font-semibold text-foreground whitespace-nowrap">
              Admin Panel
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Back to store link */}
        <div className="px-2 pt-3 pb-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
            onClick={() => setView('storefront')}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="hidden lg:block text-sm">Back to Store</span>
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-2 py-2 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                adminPage === item.id ? 'admin-nav-active' : 'text-muted-foreground'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-border p-3">
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin</p>
              <p className="text-xs text-muted-foreground truncate">manager@onestop.com</p>
            </div>
          </div>
          <div className="lg:hidden flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
              A
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-foreground capitalize">{adminPage}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <span>Onestop Cash and Carry</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}