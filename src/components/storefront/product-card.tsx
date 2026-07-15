'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useCartStore, usePageStore } from '@/stores';

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

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { setStorefrontPage, setSelectedProductId } = usePageStore();

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Card
      className="product-card group cursor-pointer overflow-hidden h-full flex flex-col border-white/[0.06] bg-white/[0.02]"
      onClick={() => {
        setSelectedProductId(product.id);
        setStorefrontPage('product-detail');
      }}
    >
      {/* Image area */}
      <div className="relative h-48 sm:h-56 bg-gradient-to-b from-[#0C1220] to-[#111827] flex items-center justify-center overflow-hidden">
        {product.isFeatured && (
          <Badge className="absolute top-2.5 left-2.5 bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black text-[10px] px-2 py-0.5 z-10 font-bold border-0 shadow-[0_2px_8px_rgba(245,180,0,0.3)]">
            <Star className="w-2.5 h-2.5 mr-0.5 fill-current" /> Featured
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2.5 right-2.5 bg-[#EF4444] text-white text-[10px] px-2 py-0.5 z-10 font-bold border-0">
            -{discount}%
          </Badge>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="text-5xl font-black text-white/[0.04] select-none">
            {product.name.charAt(0)}
          </div>
        )}
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[rgba(5,7,13,0.9)] to-transparent pointer-events-none" />
      </div>

      <CardContent className="p-4 flex flex-col flex-1 gap-1">
        {product.category && (
          <span className="text-[10px] text-white/30 uppercase tracking-[0.1em] font-semibold">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-[13px] leading-[1.3] line-clamp-2 text-white/90 group-hover:text-white transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto pt-2">
          {/* Premium price display */}
          <div className="flex items-baseline gap-2">
            <p className="price-enterprise">Rs. {product.price.toLocaleString()}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-white/25 line-through">Rs. {product.compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          {product.stock > 0 ? (
            <p className="text-[10px] text-emerald-400/70 font-medium mt-1">In Stock</p>
          ) : (
            <p className="text-[10px] text-red-400/70 font-medium mt-1">Out of Stock</p>
          )}
        </div>

        <Button
          size="sm"
          className="w-full mt-3 text-[12px] font-bold rounded-xl h-10 bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black hover:from-[#FFD44D] hover:to-[#F5B400] shadow-[0_4px_15px_rgba(245,180,0,0.2)] hover:shadow-[0_8px_25px_rgba(245,180,0,0.25)] transition-all duration-300 disabled:opacity-40 disabled:shadow-none"
          disabled={product.stock <= 0}
          onClick={(e) => {
            e.stopPropagation();
            addItem({
              id: product.id + '-' + Date.now(),
              productId: product.id,
              productName: product.name,
              productPrice: product.price,
              unit: product.unit,
            });
          }}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}