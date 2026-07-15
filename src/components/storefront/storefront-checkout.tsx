'use client';

import { useState } from 'react';
import { useCartStore, usePageStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag, CheckCircle2 } from 'lucide-react';

export function StorefrontCheckout() {
  const { items, getTotal, clearCart } = useCartStore();
  const { setStorefrontPage } = usePageStore();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  const total = getTotal();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || items.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name,
          customerPhone: form.phone,
          customerEmail: form.email || undefined,
          notes: form.notes || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productPrice: item.productPrice,
            quantity: item.quantity,
          })),
        }),
      });

      if (res.ok) {
        clearCart();
        setSuccess(true);
      }
    } catch { /* silent */ }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-2">Thank you for shopping with Onestop Cash & Carry.</p>
        <p className="text-sm text-muted-foreground mb-6">We will contact you on {form.phone} to confirm your order.</p>
        <Button onClick={() => { setStorefrontPage('home'); setSuccess(false); }}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-muted-foreground">Your cart is empty</h2>
        <Button variant="outline" className="mt-4" onClick={() => setStorefrontPage('products')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <button
        onClick={() => setStorefrontPage('products')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="0300-1234567"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special instructions..."
                    rows={3}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full" disabled={submitting || !form.name || !form.phone}>
                  {submitting ? 'Placing Order...' : `Place Order - Rs. ${total.toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">Rs. {item.productPrice.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <p className="font-medium shrink-0 ml-2">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator />
              <div className="flex items-center justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">Rs. {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}