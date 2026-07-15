'use client';

import { useViewStore } from '@/stores';
import { ShoppingCart, ShieldCheck, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/stores';
import { useState } from 'react';
import Image from 'next/image';

export function StoreHeader() {
  const { view, setView } = useViewStore();
  const { toggleCart, getItemCount } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const itemCount = getItemCount();

  return (
    <header className="sticky top-0 z-50 bg-[rgba(5,7,13,0.90)] backdrop-blur-[18px] border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <Image
              src="/logo.png"
              alt="Onestop Cash & Carry"
              width={42}
              height={42}
              className="rounded-lg object-contain"
            />
            <div className="hidden sm:block">
              <h1 className="text-lg font-extrabold text-white leading-tight tracking-tight">
                ONESTOP <span className="text-[var(--gold)]">CASH & CARRY</span>
              </h1>
              <p className="text-[9px] text-[var(--gold)] leading-tight tracking-[0.2em] uppercase font-medium">
                Premium Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => window.location.reload()}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm font-medium text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
              }}
            >
              Products
            </Button>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Cart button (storefront only) */}
            {view === 'storefront' && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/80 hover:text-white hover:bg-white/5"
                onClick={toggleCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-[var(--gold)] text-black font-bold border-2 border-[#05070D]">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Admin toggle */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-xs border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/5"
              onClick={() => setView(view === 'admin' ? 'storefront' : 'admin')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {view === 'admin' ? 'Store' : 'Admin'}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[rgba(255,255,255,0.08)] space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => {
                window.location.reload();
                setMobileMenuOpen(false);
              }}
            >
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }}
            >
              Products
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => {
                setView(view === 'admin' ? 'storefront' : 'admin');
                setMobileMenuOpen(false);
              }}
            >
              <ShieldCheck className="w-4 h-4 mr-2" />
              {view === 'admin' ? 'Switch to Store' : 'Switch to Admin'}
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}