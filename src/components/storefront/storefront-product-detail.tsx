'use client';

import { useEffect, useState } from 'react';
import { useCartStore, usePageStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Package, Truck, Shield, RotateCcw } from 'lucide-react';

interface ProductDetail {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  unit: string;
  sku: string | null;
  isFeatured: boolean;
  category?: { name: string; slug: string } | null;
}

export function StorefrontProductDetail() {
  const { selectedProductId, setStorefrontPage } = usePageStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!selectedProductId) return;
    setLoading(true);
    fetch(`/api/products?id=${selectedProductId}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setProduct(data))
      .finally(() => setLoading(false));
  }, [selectedProductId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-80 md:h-96 rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Product not found</p>
        <Button variant="outline" className="mt-4" onClick={() => setStorefrontPage('home')}>
          Go Back
        </Button>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id + '-' + Date.now() + '-' + i,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        unit: product.unit,
      });
    }
    setQty(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      {/* Breadcrumb */}
      <button
        onClick={() => setStorefrontPage('products')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        {/* Image placeholder */}
        <div className="relative h-64 sm:h-80 md:h-96 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          {discount > 0 && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white text-sm px-2.5 py-0.5">
              -{discount}% OFF
            </Badge>
          )}
          <span className="text-8xl font-bold text-primary/15">{product.name.charAt(0)}</span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {product.category && (
            <Badge variant="secondary" className="w-fit text-xs uppercase tracking-wider">
              {product.category.name}
            </Badge>
          )}

          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-muted-foreground line-through">
                Rs. {product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {product.sku && <span>SKU: {product.sku}</span>}
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {product.stock > 0 ? (
                <span className="text-green-600 font-medium">{product.stock} in stock</span>
              ) : (
                <span className="text-red-500 font-medium">Out of stock</span>
              )}
            </span>
          </div>

          <Separator />

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg">
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(Math.max(1, qty - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{qty}</span>
              <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQty(qty + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Add to Cart - Rs. {(product.price * qty).toLocaleString()}
            </Button>
          </div>

          <Separator />

          {/* Info badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Truck className="h-5 w-5 text-primary mb-1.5" />
              <span className="text-xs text-muted-foreground">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <Shield className="h-5 w-5 text-primary mb-1.5" />
              <span className="text-xs text-muted-foreground">Genuine Product</span>
            </div>
            <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
              <RotateCcw className="h-5 w-5 text-primary mb-1.5" />
              <span className="text-xs text-muted-foreground">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}