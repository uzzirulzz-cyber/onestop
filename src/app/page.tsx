'use client';

import { useEffect } from 'react';
import { useViewStore, usePageStore } from '@/stores';
import { StoreHeader } from '@/components/storefront/store-header';
import { CartSheet } from '@/components/storefront/store-cart';
import { StoreFooter } from '@/components/storefront/store-footer';
import { HeroSection } from '@/components/storefront/hero-section';
import { StorefrontHome } from '@/components/storefront/storefront-home';
import { StorefrontProducts } from '@/components/storefront/storefront-products';
import { StorefrontProductDetail } from '@/components/storefront/storefront-product-detail';
import { StorefrontCheckout } from '@/components/storefront/storefront-checkout';
import { AdminPanel } from '@/components/admin/admin-panel';

export default function Home() {
  const { view } = useViewStore();
  const { storefrontPage, setStorefrontPage, setSelectedCategoryId } = usePageStore();

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.page === 'products') {
        setStorefrontPage('products');
        if (detail.category) setSelectedCategoryId(detail.category);
      } else if (detail?.page) {
        setStorefrontPage(detail.page);
      }
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [setStorefrontPage, setSelectedCategoryId]);

  if (view === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      <CartSheet />
      <main className="flex-1">
        <div style={{ display: storefrontPage === 'home' ? 'block' : 'none' }}><HeroSection /><StorefrontHome /></div>
        <div style={{ display: storefrontPage === 'products' ? 'block' : 'none' }}><StorefrontProducts /></div>
        <div style={{ display: storefrontPage === 'product-detail' ? 'block' : 'none' }}><StorefrontProductDetail /></div>
        <div style={{ display: storefrontPage === 'checkout' ? 'block' : 'none' }}><StorefrontCheckout /></div>
      </main>
      <StoreFooter />
    </div>
  );
}