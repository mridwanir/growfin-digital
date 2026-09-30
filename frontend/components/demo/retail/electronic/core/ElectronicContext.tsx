'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export const getElectronicPlaceholderImage = (id: string | number) => {
  const placeholders = [
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?q=80&w=800&auto=format&fit=crop"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return placeholders[Math.abs(hash) % placeholders.length];
};

export interface ElectronicCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  selectedColor: string;
  selectedVariant: string;
  totalPrice: number;
}

interface ElectronicContextType {
  client: BusinessDemo;
  cart: ElectronicCartItem[];
  addToCart: (item: ElectronicCartItem) => void;
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

const ElectronicContext = createContext<ElectronicContextType | undefined>(undefined);

export function ElectronicProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<ElectronicCartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);

  const addToCart = (item: ElectronicCartItem) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id && i.selectedVariant === item.selectedVariant && i.selectedColor === item.selectedColor);
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
    <ElectronicContext.Provider value={{
      client, cart, addToCart, removeFromCart, updateCartItemQuantity, clearCart, cartTotal, cartItemCount,
      isCartDrawerOpen, setIsCartDrawerOpen, isProductModalOpen, setIsProductModalOpen, selectedProduct, setSelectedProduct
    }}>
      {children}
    </ElectronicContext.Provider>
  );
}

export function useElectronicDemo() {
  const context = useContext(ElectronicContext);
  if (context === undefined) {
    throw new Error('useElectronicDemo must be used within a ElectronicProvider');
  }
  return context;
}
