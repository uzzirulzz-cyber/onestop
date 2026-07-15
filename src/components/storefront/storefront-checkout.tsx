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
        <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-4 border border-[#10B981]/20">
          <CheckCircle2 className="w-8 h-8 text-[#10B981]" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Order Placed Successfully!</h2>
        <p className="text-white/50 mb-2">Thank you for shopping with Onestop Cash & Carry.</p>
        <p className="text-sm text-white/40 mb-6">We will contact you on {form.phone} to confirm your order.</p>
        <Button
          onClick={() => { setStorefrontPage('home'); setSuccess(false); }}
          className="bg-[var(--gold)] text-black font-bold rounded-full hover:bg-[var(--gold-light)] transition-all"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-white/50">Your cart is empty</h2>
        <Button
          variant="outline"
          className="mt-4 border-white/10 text-white/60 hover:text-white hover:bg-white/5"
          onClick={() => setStorefrontPage('products')}
        >
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <button
        onClick={() => setStorefrontPage('products')}
        className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <h1 className="text-2xl font-bold mb-6 text-white">Checkout</h1>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3">
          <Card className="bg-white/[0.03] border-white/[0.08] rounded-[18px]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/70">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[var(--gold)]/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/70">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="0300-1234567"
                      required
                      className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[var(--gold)]/50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/70">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[var(--gold)]/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white/70">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/20 focus:border-[var(--gold)]/50"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-[var(--gold)] text-black font-bold rounded-full hover:bg-[var(--gold-light)] hover:shadow-[0_15px_35px_rgba(245,180,0,0.3)] transition-all text-base"
                  disabled={submitting || !form.name || !form.phone}
                >
                  {submitting ? 'Placing Order...' : `Place Order - Rs. ${total.toLocaleString()}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <Card className="sticky top-20 bg-white/[0.03] border-white/[0.08] rounded-[18px]">
            <CardHeader>
              <CardTitle className="text-lg text-white">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-white/90">{item.productName}</p>
                    <p className="text-xs text-white/40">Rs. {item.productPrice.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <p className="font-medium shrink-0 ml-2 text-white">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator className="bg-white/[0.08]" />
              <div className="flex items-center justify-between font-bold text-lg pt-2">
                <span className="text-white">Total</span>
                <span className="text-[var(--gold)]">Rs. {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}