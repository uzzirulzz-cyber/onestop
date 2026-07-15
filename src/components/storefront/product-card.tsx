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
      className="product-card group cursor-pointer overflow-hidden h-full flex flex-col border-white/[0.08] bg-white/[0.03]"
      onClick={() => {
        setSelectedProductId(product.id);
        setStorefrontPage('product-detail');
      }}
    >
      {/* Image area */}
      <div className="relative h-48 sm:h-56 bg-[#0C1220] flex items-center justify-center overflow-hidden">
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-[var(--gold)] text-black text-[10px] px-1.5 py-0 z-10 font-bold">
            <Star className="w-2.5 h-2.5 mr-0.5" /> Featured
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-[#EF4444] text-white text-[10px] px-1.5 py-0 z-10 font-bold">
            -{discount}%
          </Badge>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-5xl font-black text-white/[0.06]">
            {product.name.charAt(0)}
          </div>
        )}
        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#05070D] to-transparent pointer-events-none" />
      </div>

      <CardContent className="p-4 flex flex-col flex-1 gap-1.5">
        {product.category && (
          <span className="text-[10px] text-white/40 uppercase tracking-wider font-medium">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2 text-white group-hover:text-[var(--gold)] transition-colors">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="font-extrabold text-[var(--gold)] text-lg leading-none">Rs. {product.price.toLocaleString()}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-white/30 line-through mt-0.5">Rs. {product.compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs">
            {product.stock > 0 ? (
              <span className="text-[#10B981] font-medium">In Stock</span>
            ) : (
              <span className="text-[#EF4444] font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          className="w-full mt-2 text-xs font-bold rounded-full bg-[var(--gold)] text-black hover:bg-[var(--gold-light)] hover:shadow-[0_10px_25px_rgba(245,180,0,0.2)] transition-all"
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
          <ShoppingCart className="w-3.5 h-3.5 mr-1" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}