'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export const getRetailPlaceholderImage = (id: string | number) => {
  const placeholders = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1555529733-0e670560f7e1?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80"
  ];
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return placeholders[Math.abs(hash) % placeholders.length];
};

export const RETAIL_CATALOG_IMAGES = [
  '/image/retail/clothing/alina-bordunova-Lq78VGxRJhc-unsplash.jpg',
  '/image/retail/clothing/anomaly-WWesmHEgXDs-unsplash.jpg',
  '/image/retail/clothing/caio-coelho-QRN47la37gw-unsplash.jpg',
  '/image/retail/clothing/dmitry-ganin-EhWzbMPQcqQ-unsplash.jpg',
  '/image/retail/clothing/junko-nakase-Q-72wa9-7Dg-unsplash.jpg',
  '/image/retail/clothing/mediamodifier-7cERndkOyDw-unsplash.jpg',
  '/image/retail/clothing/parker-burchfield-tvG4WvjgsEY-unsplash.jpg',
  '/image/retail/clothing/tanya-layko-QINaeQQHghQ-unsplash.jpg',
  '/image/retail/clothing/thom-bradley-mwa_nzFpnJw-unsplash.jpg',
  '/image/retail/clothing/tobias-tullius-Fg15LdqpWrs-unsplash.jpg'
];

export const getClothingPlaceholderImage = (id: number | string) => {
  const str = String(id);
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return RETAIL_CATALOG_IMAGES[Math.abs(hash) % RETAIL_CATALOG_IMAGES.length];
};

export interface RetailCartItem {
  id: string;
  product: MenuItem;
  quantity: number;
  totalPrice: number;
  // Unified customization options
  selectedOptions?: Record<string, string>;
  selectedAddons?: string[];
  notes?: string;
}

export type FulfillmentMode = 'PICKUP' | 'DELIVERY' | 'HOME_SERVICE';

interface RetailContextType {
  client: BusinessDemo;
  
  // Cart State
  cart: RetailCartItem[];
  addToCart: (item: RetailCartItem) => void;
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

  // Modals (Unified names for compatibility with all templates)
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isCartModalOpen: boolean;
  setIsCartModalOpen: (open: boolean) => void;
  
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  isCustomizationModalOpen: boolean;
  setIsCustomizationModalOpen: (open: boolean) => void;
  
  selectedProduct: MenuItem | null;
  setSelectedProduct: (product: MenuItem | null) => void;
  selectedProductForCustomization: MenuItem | null;
  setSelectedProductForCustomization: (product: MenuItem | null) => void;

  // Operational Logic
  isOpenNow: boolean;
}

const RetailDemoContext = createContext<RetailContextType | undefined>(undefined);

export function RetailDemoProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [cart, setCart] = useState<RetailCartItem[]>([]);
  const [fulfillmentMode, setFulfillmentMode] = useState<FulfillmentMode>('PICKUP');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Unified Modals State
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const isCartModalOpen = isCartDrawerOpen; // Alias
  const setIsCartModalOpen = setIsCartDrawerOpen; // Alias
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const isCustomizationModalOpen = isProductModalOpen; // Alias
  const setIsCustomizationModalOpen = setIsProductModalOpen; // Alias
  
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const selectedProductForCustomization = selectedProduct; // Alias
  const setSelectedProductForCustomization = setSelectedProduct; // Alias

  const [isOpenNow, setIsOpenNow] = useState(true);
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

  const addToCart = (item: RetailCartItem) => {
    setCart((prev) => {
      // Basic check for existing item matching options
      const existing = prev.find(i => {
        if (i.id !== item.id) return false;
        if (JSON.stringify(i.selectedOptions) !== JSON.stringify(item.selectedOptions)) return false;
        return true;
      });
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
    <RetailDemoContext.Provider value={{
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
      isCartDrawerOpen,
      setIsCartDrawerOpen,
      isCartModalOpen,
      setIsCartModalOpen,
      isProductModalOpen,
      setIsProductModalOpen,
      isCustomizationModalOpen,
      setIsCustomizationModalOpen,
      selectedProduct,
      setSelectedProduct,
      selectedProductForCustomization,
      setSelectedProductForCustomization,
      isOpenNow
    }}>
      {children}
    </RetailDemoContext.Provider>
  );
}

export function useRetailDemo() {
  const context = useContext(RetailDemoContext);
  if (context === undefined) {
    throw new Error('useRetailDemo must be used within a RetailDemoProvider');
  }
  return context;
}
