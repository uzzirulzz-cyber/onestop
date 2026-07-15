'use client';

import { useEffect } from 'react';
import { useViewStore, usePageStore, useCartStore } from '@/stores';
import { StoreHeader } from '@/components/storefront/store-header';
import { CartSheet } from '@/components/storefront/cart-sheet';
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

  // Listen for navigation events from components
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.page === 'products') {
        setStorefrontPage('products');
        if (detail.category) {
          setSelectedCategoryId(detail.category);
        }
      } else if (detail?.page) {
        setStorefrontPage(detail.page);
      }
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, [setStorefrontPage, setSelectedCategoryId]);

  // Admin panel
  if (view === 'admin') {
    return <AdminPanel />;
  }

  // Storefront
  const renderStorefrontContent = () => {
    switch (storefrontPage) {
      case 'products':
        return <StorefrontProducts />;
      case 'product-detail':
        return <StorefrontProductDetail />;
      case 'checkout':
      case 'order-success':
        return <StorefrontCheckout />;
      case 'home':
      default:
        return (
          <>
            <HeroSection />
            <StorefrontHome />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StoreHeader />
      <CartSheet />
      <main className="flex-1">
        {renderStorefrontContent()}
      </main>
      <StoreFooter />
    </div>
  );
}