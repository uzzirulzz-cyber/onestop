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
  Crown,
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
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-[18px] w-[18px]" /> },
  { id: 'products', label: 'Products', icon: <Package className="h-[18px] w-[18px]" /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingBag className="h-[18px] w-[18px]" /> },
  { id: 'categories', label: 'Categories', icon: <Tags className="h-[18px] w-[18px]" /> },
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-white/[0.06] bg-[#080C16] transition-all duration-300 md:relative md:z-auto',
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-16 lg:w-[260px]'
        )}
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0057D9] to-[#003B91] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(0,87,217,0.25)]">
              <Crown className="w-4 h-4 text-[#F5B400]" />
            </div>
            <div className="hidden lg:block whitespace-nowrap">
              <p className="text-[13px] font-bold text-white leading-none">ONESTOP</p>
              <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest leading-none mt-0.5">Admin Panel</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-8 w-8 text-white/40 hover:text-white rounded-lg"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Back to store link */}
        <div className="px-3 pt-4 pb-1">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-white/30 hover:text-white/60 hover:bg-white/[0.03] rounded-xl h-9 text-[13px]"
            onClick={() => setView('storefront')}
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            <span className="hidden lg:block">Back to Store</span>
          </Button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200',
                adminPage === item.id
                  ? 'admin-nav-active'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/[0.03]'
              )}
            >
              <span className="shrink-0">{item.icon}</span>
              <span className="hidden lg:block whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-white/[0.06] p-3">
          <div className="hidden lg:flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0057D9]/30 to-[#0057D9]/10 text-[#3A8DFF] text-[11px] font-bold border border-[#0057D9]/20">
              A
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-white/80 truncate">Admin</p>
              <p className="text-[11px] text-white/25 truncate">manager@onestop.com</p>
            </div>
          </div>
          <div className="lg:hidden flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#0057D9]/30 to-[#0057D9]/10 text-[#3A8DFF] text-[11px] font-bold border border-[#0057D9]/20">
              A
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-white/[0.06] bg-[rgba(8,12,22,0.8)] backdrop-blur-md px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-9 w-9 text-white/40 hover:text-white rounded-lg"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-[15px] font-semibold text-white/90 capitalize">{adminPage}</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[12px] text-white/25">
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