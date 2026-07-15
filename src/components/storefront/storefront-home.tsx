'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight, Flame } from 'lucide-react';
import { usePageStore } from '@/stores';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { products: number };
  image?: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  unit: string;
  isFeatured: boolean;
  image?: string | null;
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-7">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Shop by Category</h2>
            <p className="text-sm text-white/30 mt-1">Browse our curated collections</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white/70 text-[13px] rounded-lg h-8"
            onClick={() => setStorefrontPage('products')}
          >
            View All <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-[18px] bg-white/[0.04]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 stagger-children">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className="category-card rounded-[18px] p-4 text-center overflow-hidden group animate-fade-up"
                onClick={() => {
                  const event = new CustomEvent('navigate', { detail: { page: 'products', category: cat.slug } });
                  window.dispatchEvent(event);
                }}
              >
                {cat.image ? (
                  <div className="w-full h-16 rounded-xl overflow-hidden mb-3 bg-white/[0.03]">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out" />
                  </div>
                ) : (
                  <div className="w-full h-16 rounded-xl bg-white/[0.04] flex items-center justify-center mb-3 group-hover:bg-white/[0.06] transition-colors">
                    <span className="text-3xl">{CATEGORY_ICONS[cat.slug] || '📦'}</span>
                  </div>
                )}
                <p className="font-semibold text-[13px] text-white/90 group-hover:text-white transition-colors">{cat.name}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{cat._count.products} items</p>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-7">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#F5B400] to-[#D49900] flex items-center justify-center">
              <Flame className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Featured Products</h2>
              <p className="text-sm text-white/30 mt-0.5">Handpicked items at the best prices</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/40 hover:text-white/70 text-[13px] rounded-lg h-8"
            onClick={() => setStorefrontPage('products')}
          >
            See All <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="rounded-[22px] border border-white/[0.06] overflow-hidden bg-white/[0.02]">
                <Skeleton className="h-48 bg-white/[0.04]" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16 bg-white/[0.04]" />
                  <Skeleton className="h-4 w-full bg-white/[0.04]" />
                  <Skeleton className="h-10 w-full mt-2 bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 stagger-children">
            {featured.slice(0, 5).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Why Choose Onestop?</h2>
            <p className="text-sm text-white/30 mt-2 max-w-md mx-auto">We are committed to delivering excellence in every aspect of your shopping experience</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {[
              { title: 'Best Prices', desc: 'Competitive wholesale rates for all products. We beat market prices guaranteed.', icon: '💰' },
              { title: 'Wide Selection', desc: 'From daily groceries to household essentials, find everything under one roof.', icon: '🏪' },
              { title: 'Quality Assured', desc: 'Every product is sourced from trusted suppliers and brands you know.', icon: '✅' },
              { title: 'Quick Service', desc: 'Fast checkout and efficient delivery. Your time matters to us.', icon: '⚡' },
            ].map((item) => (
              <div key={item.title} className="glass-card text-center animate-fade-up">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-[15px] mb-2 text-white">{item.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="offer-gradient p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="relative z-10">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/60 mb-2">Limited Time</p>
            <h3 className="text-2xl md:text-3xl font-black text-white">Mega Sale!</h3>
            <p className="text-white/70 mt-2 text-[15px]">Get up to 15% off on all grocery items. Limited time offer.</p>
          </div>
          <Button
            size="lg"
            className="bg-white text-[#003B91] font-bold rounded-[50px] px-8 hover:bg-white/90 shadow-[0_8px_25px_rgba(0,0,0,0.3)] transition-all text-[14px] relative z-10"
            onClick={() => setStorefrontPage('products')}
          >
            Shop Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
}