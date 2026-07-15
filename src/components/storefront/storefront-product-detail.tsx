'use client';

import { useEffect, useState } from 'react';
import { usePageStore, useCartStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ShoppingCart, Star, Minus, Plus, Truck, Shield, RotateCcw } from 'lucide-react';

export function StorefrontProductDetail() {
  const { selectedProductId, setStorefrontPage } = usePageStore();
  const { addItem } = useCartStore();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
    if (!selectedProductId) return;
    fetch(`/api/products?id=${selectedProductId}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [selectedProductId]);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <button onClick={() => setStorefrontPage('products')} className="text-[13px] text-white/40 mb-6 block hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4 inline mr-1" /> Back to Products
        </button>
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[#F5B400] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/40 text-[14px]">Loading product...</p>
        </div>
      </div>
    );
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id + '-' + Date.now() + '-' + i,
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        unit: product.unit,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <button
        onClick={() => setStorefrontPage('products')}
        className="flex items-center gap-1.5 text-[13px] text-white/40 mb-6 hover:text-white/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Product Image */}
        <div className="relative rounded-[22px] overflow-hidden bg-gradient-to-b from-[#0C1220] to-[#111827] border border-white/[0.06]">
          {product.isFeatured && (
            <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black text-[11px] px-2.5 py-0.5 font-bold border-0 shadow-[0_2px_8px_rgba(245,180,0,0.3)]">
              <Star className="w-3 h-3 mr-1 fill-current" /> Featured
            </Badge>
          )}
          {discount > 0 && (
            <Badge className="absolute top-4 right-4 z-10 bg-[#EF4444] text-white text-[11px] px-2.5 py-0.5 font-bold border-0">
              -{discount}% OFF
            </Badge>
          )}
          <div className="h-72 sm:h-80 md:h-[420px] flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[120px] font-black text-white/[0.03] select-none">{product?.name?.charAt(0) || ''}</span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-[11px] text-white/30 uppercase tracking-[0.1em] font-semibold mb-2">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight tracking-tight">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-0.5 text-[#F5B400]">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-[12px] text-white/30">(4.8)</span>
          </div>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="text-[32px] font-extrabold leading-none gradient-text-gold">Rs. {product.price.toLocaleString()}</span>
            {product.compareAtPrice && (
              <span className="text-lg text-white/20 line-through">Rs. {product.compareAtPrice.toLocaleString()}</span>
            )}
            {discount > 0 && (
              <Badge className="bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20 text-[11px] font-bold">
                Save {discount}%
              </Badge>
            )}
          </div>

          <p className="text-[13px] text-white/35 mt-2">Per {product.unit}</p>

          {/* Stock */}
          <div className="mt-4">
            {product.stock > 0 ? (
              <span className="text-[13px] font-medium text-emerald-400/80">● In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-[13px] font-medium text-red-400/80">● Out of Stock</span>
            )}
          </div>

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[13px] text-white/40">Quantity:</span>
            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04]"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-10 text-center text-lg font-bold text-white">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-xl border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.04]"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Add to Cart */}
          <Button
            size="lg"
            className="mt-6 w-full bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-2xl h-12 hover:from-[#FFD44D] hover:to-[#F5B400] shadow-[0_4px_15px_rgba(245,180,0,0.2)] hover:shadow-[0_8px_25px_rgba(245,180,0,0.3)] transition-all text-[14px]"
            disabled={product.stock <= 0}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart - Rs. {(product.price * quantity).toLocaleString()}
          </Button>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, label: 'Free Delivery' },
              { icon: Shield, label: 'Genuine' },
              { icon: RotateCcw, label: 'Easy Return' },
            ].map((f) => (
              <div key={f.label} className="flex flex-col items-center gap-1.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                <f.icon className="w-5 h-5 text-[#3A8DFF]" />
                <span className="text-[10px] text-white/40 font-medium">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}