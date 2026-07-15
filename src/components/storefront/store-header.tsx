'use client';

import { useViewStore } from '@/stores';
import { ShoppingCart, ShieldCheck, Store, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores';
import { useState } from 'react';

export function StoreHeader() {
  const { view, setView } = useViewStore();
  const { toggleCart, getItemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground leading-tight">Onestop</h1>
              <p className="text-[10px] text-muted-foreground leading-tight tracking-wider uppercase">Cash & Carry</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => window.location.reload()}>
              Home
            </Button>
            <Button variant="ghost" size="sm" className="text-sm font-medium" onClick={() => {
              const event = new CustomEvent('navigate', { detail: { page: 'products' } });
              window.dispatchEvent(event);
            }}>
              Products
            </Button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart button (storefront only) */}
            {view === 'storefront' && (
              <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground border-2 border-white">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Admin toggle */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-xs"
              onClick={() => setView(view === 'admin' ? 'storefront' : 'admin')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {view === 'admin' ? 'Store' : 'Admin'}
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-border space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => {
              window.location.reload();
              setMobileMenuOpen(false);
            }}>
              Home
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => {
              const event = new CustomEvent('navigate', { detail: { page: 'products' } });
              window.dispatchEvent(event);
              setMobileMenuOpen(false);
            }}>
              Products
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start text-sm" onClick={() => {
              setView(view === 'admin' ? 'storefront' : 'admin');
              setMobileMenuOpen(false);
            }}>
              <ShieldCheck className="w-4 h-4 mr-2" />
              {view === 'admin' ? 'Switch to Store' : 'Switch to Admin'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}