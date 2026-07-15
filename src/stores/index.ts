import { create } from 'zustand';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  unit: string;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  toggleCart: () => set((s) => ({ isCartOpen: !s.isCartOpen })),
  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId ? { ...i, quantity } : i
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    return get().items.reduce((sum, item) => sum + item.productPrice * item.quantity, 0);
  },
  getItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

export interface ViewMode {
  view: 'storefront' | 'admin';
  setView: (view: 'storefront' | 'admin') => void;
}

export const useViewStore = create<ViewMode>((set) => ({
  view: 'storefront',
  setView: (view) => set({ view }),
}));

export type StorefrontPage = 'home' | 'products' | 'product-detail' | 'checkout' | 'order-success';
export type AdminPage = 'dashboard' | 'products' | 'orders' | 'categories';

interface PageStore {
  storefrontPage: StorefrontPage;
  adminPage: AdminPage;
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  setStorefrontPage: (page: StorefrontPage) => void;
  setAdminPage: (page: AdminPage) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
}

export const usePageStore = create<PageStore>((set) => ({
  storefrontPage: 'home',
  adminPage: 'dashboard',
  selectedProductId: null,
  selectedCategoryId: null,
  setStorefrontPage: (page) => set({ storefrontPage: page }),
  setAdminPage: (page) => set({ adminPage: page }),
  setSelectedProductId: (id) => set({ selectedProductId: id }),
  setSelectedCategoryId: (id) => set({ selectedCategoryId: id }),
}));