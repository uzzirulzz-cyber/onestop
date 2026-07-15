'use client';

import { useCartStore, CartItem } from '@/stores';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

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
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 bg-[#0C1220] border-l border-white/[0.08]">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingBag className="w-5 h-5 text-[var(--gold)]" />
            Your Cart ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-3" />
              <p className="text-white/50 font-medium">Your cart is empty</p>
              <p className="text-sm text-white/30 mt-1">Add some items to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 py-2">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-start gap-3 bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight text-white">{item.productName}</p>
                      <p className="text-xs text-white/40 mt-0.5">Rs. {item.productPrice.toLocaleString()} / {item.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center text-white">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-semibold text-sm text-white">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-[#EF4444] hover:text-[#EF4444] hover:bg-[#EF4444]/10" onClick={() => removeItem(item.productId)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-white/[0.08] p-4 space-y-3 bg-[#111827]">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/50">Subtotal</span>
                <span className="font-semibold text-white">Rs. {total.toLocaleString()}</span>
              </div>
              <Separator className="bg-white/[0.08]" />
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Total</span>
                <span className="font-black text-lg text-[var(--gold)]">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-white/10 text-white/60 hover:text-white hover:bg-white/5" onClick={clearCart}>Clear</Button>
                <Button className="flex-1 bg-[var(--gold)] text-black font-bold hover:bg-[var(--gold-light)] hover:shadow-[0_10px_25px_rgba(245,180,0,0.2)] transition-all" onClick={handleCheckout}>
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