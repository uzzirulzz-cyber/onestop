'use client';

import { useState } from 'react';
import { useCartStore, usePageStore } from '@/stores';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ShoppingBag, CheckCircle2, Lock } from 'lucide-react';

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
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-5 border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-white">Order Placed Successfully!</h2>
        <p className="text-white/40 mb-1 text-[14px]">Thank you for shopping with Onestop Cash &amp; Carry.</p>
        <p className="text-[13px] text-white/30 mb-8">We will contact you on <span className="text-white/50 font-medium">{form.phone}</span> to confirm your order.</p>
        <Button
          onClick={() => { setStorefrontPage('home'); setSuccess(false); }}
          className="bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-2xl px-8 h-12 hover:from-[#FFD44D] hover:to-[#F5B400] shadow-[0_4px_15px_rgba(245,180,0,0.2)] transition-all text-[14px]"
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-7 h-7 text-white/10" />
        </div>
        <h2 className="text-xl font-semibold text-white/40">Your cart is empty</h2>
        <Button
          variant="outline"
          className="mt-5 border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] rounded-xl px-6 text-[13px]"
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
        className="flex items-center gap-1.5 text-[13px] text-white/40 hover:text-white/80 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Products
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-[#0057D9]/10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-[#3A8DFF]" />
        </div>
        <h1 className="text-xl font-bold text-white">Secure Checkout</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-6">
        {/* Form */}
        <div className="md:col-span-3">
          <Card className="bg-white/[0.02] border-white/[0.06] rounded-[18px]">
            <CardHeader>
              <CardTitle className="text-[15px] text-white/80">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white/50 text-[13px]">Full Name *</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="Your full name"
                      required
                      className="enterprise-input h-11 text-[14px] text-white placeholder:text-white/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white/50 text-[13px]">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="0300-1234567"
                      required
                      className="enterprise-input h-11 text-[14px] text-white placeholder:text-white/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/50 text-[13px]">Email (optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="enterprise-input h-11 text-[14px] text-white placeholder:text-white/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-white/50 text-[13px]">Order Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special instructions..."
                    rows={3}
                    className="enterprise-input text-[14px] text-white placeholder:text-white/20 resize-none"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-2xl h-12 hover:from-[#FFD44D] hover:to-[#F5B400] shadow-[0_4px_15px_rgba(245,180,0,0.2)] hover:shadow-[0_8px_25px_rgba(245,180,0,0.3)] transition-all text-[14px]"
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
          <Card className="sticky top-20 bg-white/[0.02] border-white/[0.06] rounded-[18px]">
            <CardHeader>
              <CardTitle className="text-[15px] text-white/80">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-[13px]">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-white/80">{item.productName}</p>
                    <p className="text-[11px] text-white/30">Rs. {item.productPrice.toLocaleString()} x {item.quantity}</p>
                  </div>
                  <p className="font-medium shrink-0 ml-2 text-white/90">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator className="bg-white/[0.06]" />
              <div className="flex items-center justify-between pt-2">
                <span className="font-semibold text-[14px] text-white">Total</span>
                <span className="text-xl font-extrabold gradient-text-gold">Rs. {total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}