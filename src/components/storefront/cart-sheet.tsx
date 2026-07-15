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
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length} items)
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground font-medium">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Add some items to get started</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4">
              <div className="space-y-3 py-2">
                {items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm leading-tight">{item.productName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Rs. {item.productPrice.toLocaleString()} / {item.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <p className="font-semibold text-sm">Rs. {(item.productPrice * item.quantity).toLocaleString()}</p>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeItem(item.productId)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t p-4 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-semibold">Rs. {total.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg text-primary">Rs. {total.toLocaleString()}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={clearCart}>Clear</Button>
                <Button className="flex-1" onClick={handleCheckout}>
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