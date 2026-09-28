'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export interface ClothingCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  selectedVariants: Record<string, string>; 
  selectedAddons: string[];
  notes: string;
  totalPrice: number;
}

export type FulfillmentMode = 'PICKUP' | 'DELIVERY' | 'HOME_SERVICE';

interface ClothingContextType {
  client: BusinessDemo;
  
  // Cart State
  cart: ClothingCartItem[];
  addToCart: (item: ClothingCartItem) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Checkout & Fulfillment State
  fulfillmentMode: FulfillmentMode;
  setFulfillmentMode: (mode: FulfillmentMode) => void;
  deliveryAddress: string;
  setDeliveryAddress: (addr: string) => void;

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

const ClothingContext = createContext<ClothingContextType | undefined>(undefined);

export function ClothingProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<ClothingCartItem[]>([]);
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
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
      const interval = setInterval(checkIsOpen, 60000); 
      return () => clearInterval(interval);
    }
  }, [client.openTime, client.closeTime]);

  const addToCart = (item: ClothingCartItem) => {
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
    <ClothingContext.Provider value={{
      client,
      cart,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      clearCart,
      cartTotal,
      cartItemCount,
      fulfillmentMode,
      setFulfillmentMode,
      deliveryAddress,
      setDeliveryAddress,
      isCartModalOpen,
      setIsCartModalOpen,
      isCustomizationModalOpen,
      setIsCustomizationModalOpen,
      selectedProductForCustomization,
      setSelectedProductForCustomization,
      isOpenNow
    }}>
      {children}
    </ClothingContext.Provider>
  );
}

export function useClothingDemo() {
  const context = useContext(ClothingContext);
  if (context === undefined) {
    throw new Error('useClothingDemo must be used within a ClothingProvider');
  }
  return context;
}
