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
      className="product-card group cursor-pointer border-border/60 overflow-hidden h-full flex flex-col"
      onClick={() => {
        setSelectedProductId(product.id);
        setStorefrontPage('product-detail');
      }}
    >
      {/* Image area */}
      <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden">
        {product.isFeatured && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] px-1.5 py-0 z-10">
            <Star className="w-2.5 h-2.5 mr-0.5" /> Featured
          </Badge>
        )}
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-1.5 py-0 z-10">
            -{discount}%
          </Badge>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-4xl font-bold text-primary/20">
            {product.name.charAt(0)}
          </div>
        )}
      </div>

      <CardContent className="p-3 flex flex-col flex-1 gap-1.5">
        {product.category && (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
            {product.category.name}
          </span>
        )}
        <h3 className="font-semibold text-sm leading-tight line-clamp-2">{product.name}</h3>

        <div className="mt-auto flex items-end justify-between pt-1">
          <div>
            <p className="font-bold text-primary text-base">Rs. {product.price.toLocaleString()}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-muted-foreground line-through">Rs. {product.compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock</span>
            ) : (
              <span className="text-red-500 font-medium">Out of Stock</span>
            )}
          </div>
        </div>

        <Button
          size="sm"
          className="w-full mt-1 text-xs"
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