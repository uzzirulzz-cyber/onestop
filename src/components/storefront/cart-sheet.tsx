'use client';

import { useCartStore, CartItem } from '@/stores';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag, Crown } from 'lucide-react';

export function CartSheet() {
  const { items, isCartOpen, setCartOpen, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const total = getTotal();

  const handleCheckout = () => {
    setCartOpen(false);
    const event = new CustomEvent('navigate', { detail: { page: 'checkout' } });
    window.dispatchEvent(event);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-[#0A0E1A] border-l border-white/[0.06]">
        <SheetHeader className="p-5 pb-3 border-b border-white/[0.06]">
          <SheetTitle className="flex items-center gap-2.5 text-white text-[15px] font-semibold">
            <div className="w-8 h-8 rounded-lg bg-[#F5B400]/10 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#F5B400]" />
            </div>
            Your Cart
            <span className="text-white/30 font-normal text-[13px]">({items.length} items)</span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-7 h-7 text-white/10" />
              </div>
              <p className="text-white/40 font-medium text-[15px]">Your cart is empty</p>
              <p className="text-[13px] text-white/20 mt-1">Add some items to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5">
              <div className="space-y-2.5 py-4">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-start gap-3 bg-white/[0.02] rounded-xl p-3 border border-white/[0.05] hover:border-white/[0.08] transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[13px] leading-tight text-white/90">{item.productName}</p>
                      <p className="text-[11px] text-white/30 mt-1">Rs. {item.productPrice.toLocaleString()} / {item.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7 border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-[13px] font-semibold w-6 text-center text-white">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7 border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-semibold text-[13px] text-white">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 rounded-lg" onClick={() => removeItem(item.productId)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-white/[0.06] p-5 space-y-3 bg-[rgba(8,12,22,0.8)] backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-white/40">Subtotal</span>
                <span className="font-medium text-[13px] text-white/70">Rs. {total.toLocaleString()}</span>
              </div>
              <Separator className="bg-white/[0.06]" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[14px] text-white">Total</span>
                <span className="price-enterprise text-[20px]">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1 border-white/[0.08] text-white/40 hover:text-white hover:bg-white/[0.04] rounded-xl h-11 text-[13px]" onClick={clearCart}>Clear</Button>
                <Button className="flex-1 bg-gradient-to-r from-[#F5B400] to-[#D49900] text-black font-bold rounded-xl h-11 text-[13px] hover:from-[#FFD44D] hover:to-[#F5B400] shadow-[0_4px_15px_rgba(245,180,0,0.2)] transition-all" onClick={handleCheckout}>
                  Checkout
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}