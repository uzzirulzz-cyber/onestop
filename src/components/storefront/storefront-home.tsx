'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { usePageStore } from '@/stores';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
}

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  unit: string;
  isFeatured: boolean;
  category?: { name: string; slug: string } | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  'groceries': '🌾',
  'beverages': '🥤',
  'snacks-chocolates': '🍫',
  'household': '🧹',
  'personal-care': '🧴',
  'dairy-fresh': '🥛',
};

export function StorefrontHome() {
  const { setStorefrontPage } = usePageStore();
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?featured=true'),
        fetch('/api/categories'),
      ]);
      if (prodRes.ok) setFeatured(await prodRes.json());
      if (catRes.ok) setCategories(await catRes.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div>
      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold">Shop by Category</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setStorefrontPage('products')}
          >
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-card rounded-xl border border-border bg-card p-4 text-center hover:border-primary/30"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: { page: 'products', category: cat.slug } });
                  window.dispatchEvent(event);
                }}
              >
                <div className="text-3xl mb-2">{CATEGORY_ICONS[cat.slug] || '📦'}</div>
                <p className="font-semibold text-sm">{cat.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{cat._count.products} items</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold">Featured Products</h2>
            <p className="text-sm text-muted-foreground mt-1">Handpicked items at the best prices</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => setStorefrontPage('products')}
          >
            See All <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border overflow-hidden">
                <Skeleton className="h-40" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {featured.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-8">Why Choose Onestop?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Best Prices', desc: 'Competitive wholesale rates for all products. We beat market prices guaranteed.' },
              { title: 'Wide Selection', desc: 'From daily groceries to household essentials, find everything under one roof.' },
              { title: 'Quality Assured', desc: 'Every product is sourced from trusted suppliers and brands you know.' },
              { title: 'Quick Service', desc: 'Fast checkout and efficient delivery. Your time matters to us.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-4">
                <h3 className="font-semibold text-base mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}