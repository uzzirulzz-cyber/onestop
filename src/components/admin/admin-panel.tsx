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
import Image from 'next/image';

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
    <div className="flex h-screen bg-[#05070D] overflow-hidden">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.08] bg-[#0C1220] transition-all duration-300 md:relative md:z-auto',
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16 lg:w-64'
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.08] px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <Image
              src="/logo.png"
              alt="Admin"
              width={32}
              height={32}
              className="rounded-lg object-contain shrink-0"
            />
            <span className="hidden lg:block text-base font-bold text-white whitespace-nowrap">
              Admin Panel
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Back to store link */}
        <div className="px-2 pt-3 pb-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/40 hover:text-white hover:bg-white/5"
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
                adminPage === item.id ? 'admin-nav-active' : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/[0.08] p-3">
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0057D9]/20 text-[#3A8DFF] text-xs font-bold">
              A
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
              <p className="text-xs text-white/30 truncate">manager@onestop.com</p>
            </div>
          </div>
          <div className="lg:hidden flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0057D9]/20 text-[#3A8DFF] text-xs font-bold">
              A
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.08] bg-[#0C1220] px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-white/60 hover:text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white capitalize">{adminPage}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-sm text-white/40">
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