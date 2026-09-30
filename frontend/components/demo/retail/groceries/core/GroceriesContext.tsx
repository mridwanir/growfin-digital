'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export const getGroceryPlaceholderImage = (id: string | number) => {
  const placeholders = [
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506617420156-8e4536971650?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1584286595398-a59f21d313f5?auto=format&fit=crop&w=800&q=80"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return placeholders[Math.abs(hash) % placeholders.length];
};

export interface GroceriesCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  selectedVariant: string; 
  selectedSize: string;
  totalPrice: number;
}

interface GroceriesContextType {
  client: BusinessDemo;
  cart: GroceriesCartItem[];
  addToCart: (item: GroceriesCartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  selectedProduct: MenuItem | null;
  setSelectedProduct: (product: MenuItem | null) => void;
}

const GroceriesContext = createContext<GroceriesContextType | undefined>(undefined);

export function GroceriesProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<GroceriesCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const addToCart = (item: GroceriesCartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant && i.selectedSize === item.selectedSize);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity, totalPrice: i.totalPrice + item.totalPrice } : i);
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const updateCartItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => 
      prev.map(item => item.id === id ? { ...item, quantity, totalPrice: (item.totalPrice / item.quantity) * quantity } : item)
    );
  };

  const clearCart = () => setCart([]);
  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <GroceriesContext.Provider value={{
      client, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, cartItemCount,
      isCartDrawerOpen, setIsCartDrawerOpen, isProductModalOpen, setIsProductModalOpen, selectedProduct, setSelectedProduct
    }}>
      {children}
    </GroceriesContext.Provider>
  );
}

export function useGroceriesDemo() {
  const context = useContext(GroceriesContext);
  if (context === undefined) {
    throw new Error('useGroceriesDemo must be used within a GroceriesProvider');
  }
  return context;
}
