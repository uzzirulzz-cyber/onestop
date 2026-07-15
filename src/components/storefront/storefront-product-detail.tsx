'use client';

import { useEffect, useState } from 'react';
import { usePageStore } from '@/stores';

export function StorefrontProductDetail() {
  const { selectedProductId, setStorefrontPage } = usePageStore();
  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    if (!selectedProductId) return;
    fetch(`/api/products?id=${selectedProductId}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [selectedProductId]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => setStorefrontPage('products')} className="text-sm text-muted-foreground mb-6 block">
        Back to Products
      </button>
      <h1 className="text-2xl font-bold">{product ? product.name : 'Loading...'}</h1>
    </div>
  );
}