'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProductCard } from '@/components/storefront/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
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
  isActive: boolean;
  image?: string | null;
  category?: { name: string; slug: string } | null;
}

export function StorefrontProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (categoryFilter && categoryFilter !== 'all') params.set('category', categoryFilter);
      const res = await fetch(`/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch { /* silent */ }
    setLoading(false);
  }, [search, categoryFilter]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) setCategories(await res.json());
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 200);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  // Listen for search from hero
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.search) {
        setSearch(detail.search);
      }
      if (detail?.category) {
        setCategoryFilter(detail.category);
      }
    };
    window.addEventListener('navigate', handler);
    return () => window.removeEventListener('navigate', handler);
  }, []);

  const activeFilter = categoryFilter !== 'all' || search;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">All Products</h2>
          {!loading && (
            <p className="text-[13px] text-white/30 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 enterprise-input h-10 text-[13px]"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-3.5 w-3.5 text-white/30 hover:text-white" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="sm:hidden border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04] h-10 w-10 rounded-xl"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category Filters */}
      <div className={`${showFilters ? 'block' : 'hidden'} sm:block mb-6`}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={categoryFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className={
              categoryFilter === 'all'
                ? 'bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-full text-[12px] h-8 shadow-[0_2px_8px_rgba(245,180,0,0.2)] border-0'
                : 'border-white/[0.08] text-white/40 rounded-full hover:text-white/70 hover:border-white/[0.15] text-[12px] h-8 bg-transparent'
            }
            onClick={() => setCategoryFilter('all')}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={categoryFilter === cat.slug ? 'default' : 'outline'}
              size="sm"
              className={
                categoryFilter === cat.slug
                  ? 'bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-full text-[12px] h-8 shadow-[0_2px_8px_rgba(245,180,0,0.2)] border-0'
                  : 'border-white/[0.08] text-white/40 rounded-full hover:text-white/70 hover:border-white/[0.15] text-[12px] h-8 bg-transparent'
              }
              onClick={() => setCategoryFilter(cat.slug)}
            >
              {cat.name}
              <span className="ml-1.5 text-[11px] opacity-50">({cat._count.products})</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Active filter indicator */}
      {activeFilter && (
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/30 hover:text-white/70 text-[12px] h-8 rounded-lg"
            onClick={() => { setCategoryFilter('all'); setSearch(''); }}
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-[22px] border border-white/[0.06] overflow-hidden bg-white/[0.02]">
              <Skeleton className="h-48 bg-white/[0.03]" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-16 bg-white/[0.03]" />
                <Skeleton className="h-4 w-full bg-white/[0.03]" />
                <Skeleton className="h-4 w-24 bg-white/[0.03]" />
                <Skeleton className="h-10 w-full mt-2 bg-white/[0.03]" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Package className="w-7 h-7 text-white/10" />
          </div>
          <h3 className="text-lg font-semibold text-white/50">No products found</h3>
          <p className="text-[13px] text-white/30 mt-1">Try adjusting your search or filters</p>
          <Button
            variant="outline"
            className="mt-5 border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04] rounded-xl text-[13px]"
            onClick={() => { setCategoryFilter('all'); setSearch(''); }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 stagger-children">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}