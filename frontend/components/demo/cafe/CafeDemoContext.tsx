'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';
import { THEMES, ThemeKey, getDefaultTheme } from '@/lib/themes';

export interface CartItem {
  id: string; // unique cart item id
  product: MenuItem;
  quantity: number;
  selectedVariants: Record<string, string>; 
  selectedAddons: string[];
  notes: string;
  totalPrice: number;
}

interface CafeDemoContextType {
  client: BusinessDemo;
  
  currentTheme: ThemeKey;
  setCurrentTheme: (theme: ThemeKey) => void;
  
  // Cart State
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Modals
  isCartModalOpen: boolean;
  setIsCartModalOpen: (open: boolean) => void;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (open: boolean) => void;
  selectedProductForCustomization: MenuItem | null;
  setSelectedProductForCustomization: (product: MenuItem | null) => void;

  // Operational Logic
  isOpenNow: boolean;
}

const CafeDemoContext = createContext<CafeDemoContextType | undefined>(undefined);

export function CafeDemoProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => getDefaultTheme(client.category));
  

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [selectedProductForCustomization, setSelectedProductForCustomization] = useState<MenuItem | null>(null);

  const [isOpenNow, setIsOpenNow] = useState(true);

  // Parse open/close times to calculate if open now
  useEffect(() => {
    if (client.openTime && client.closeTime) {
      const checkIsOpen = () => {
        const now = new Date();
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;

        const [openHour, openMin] = client.openTime!.split(':').map(Number);
        const [closeHour, closeMin] = client.closeTime!.split(':').map(Number);
        
        const openTime = openHour * 60 + openMin;
        let closeTime = closeHour * 60 + closeMin;

        if (closeTime < openTime) {
          // Crosses midnight
          if (currentTime >= openTime || currentTime < closeTime) {
            setIsOpenNow(true);
            return;
          }
        } else {
          if (currentTime >= openTime && currentTime < closeTime) {
            setIsOpenNow(true);
            return;
          }
        }
        setIsOpenNow(false);
      };

      checkIsOpen();
      const interval = setInterval(checkIsOpen, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [client.openTime, client.closeTime]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
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
    <CafeDemoContext.Provider value={{
      client,
      currentTheme,
      setCurrentTheme,
      cart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      cartTotal,
      cartItemCount,
      isCartModalOpen,
      setIsCartModalOpen,
      isCustomizationModalOpen,
      setIsCustomizationModalOpen,
      selectedProductForCustomization,
      setSelectedProductForCustomization,
      isOpenNow
    }}>
      {children}
    </CafeDemoContext.Provider>
  );
}

export function useCafeDemo() {
  const context = useContext(CafeDemoContext);
  if (context === undefined) {
    throw new Error('useCafeDemo must be used within a CafeDemoProvider');
  }
  return context;
}
