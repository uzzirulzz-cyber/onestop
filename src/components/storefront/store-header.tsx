'use client';

import { useViewStore } from '@/stores';
import { ShoppingCart, ShieldCheck, Menu, X, Crown } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-[rgba(5,7,13,0.82)] backdrop-blur-[22px] border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[72px]">
          {/* Premium Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
            {/* Logo Icon */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#0057D9] to-[#003B91] flex items-center justify-center shadow-[0_4px_15px_rgba(0,87,217,0.3)] group-hover:shadow-[0_6px_20px_rgba(0,87,217,0.4)] transition-shadow duration-300">
              <Crown className="w-5 h-5 text-[#F5B400]" strokeWidth={2.2} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#F5B400] border-2 border-[#05070D]" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-[17px] font-extrabold text-white leading-none tracking-[-0.02em]">
                ONESTOP
              </h1>
              <p className="text-[10px] font-bold text-[#F5B400] leading-none tracking-[0.15em] uppercase mt-0.5">
                Cash & Carry
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-0.5">
            {[
              { label: 'Home', action: () => window.location.reload() },
              { label: 'Products', action: () => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
              }},
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg px-4 h-9 transition-colors"
                onClick={item.action}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-1.5">
            {/* Cart button */}
            {view === 'storefront' && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white/60 hover:text-white hover:bg-white/[0.04] h-10 w-10 rounded-xl transition-colors"
                onClick={toggleCart}
              >
                <ShoppingCart className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-[18px] min-w-[18px] flex items-center justify-center p-0 text-[10px] bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold border-2 border-[#05070D] shadow-[0_2px_8px_rgba(245,180,0,0.3)]">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            )}

            {/* Admin toggle */}
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-[12px] border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.04] rounded-xl px-3 h-9 font-medium transition-all"
              onClick={() => setView(view === 'admin' ? 'storefront' : 'admin')}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {view === 'admin' ? 'Store' : 'Admin'}
            </Button>

            {/* Mobile menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white/60 hover:text-white h-10 w-10 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[rgba(255,255,255,0.06)] space-y-0.5">
            {[
              { label: 'Home', action: () => { window.location.reload(); setMobileMenuOpen(false); } },
              { label: 'Products', action: () => {
                const event = new CustomEvent('navigate', { detail: { page: 'products' } });
                window.dispatchEvent(event);
                setMobileMenuOpen(false);
              }},
            ].map((item) => (
              <Button
                key={item.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg h-10"
                onClick={item.action}
              >
                {item.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm text-white/60 hover:text-white hover:bg-white/[0.04] rounded-lg h-10"
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