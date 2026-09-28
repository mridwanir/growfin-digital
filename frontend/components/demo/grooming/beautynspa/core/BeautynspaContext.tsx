'use client';

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react';
import { BusinessDemo, MenuItem, PractitionerInfo, LookbookItem } from '@/lib/types';

export interface BeautynspaBookingState {
  preferredDate: string;
  preferredSession: 'MORNING' | 'AFTERNOON' | 'EVENING';
  preferredPractitioner: PractitionerInfo | null;
  referenceLookbook: LookbookItem | null;
  customerName: string;
}

interface BeautynspaContextType {
  client: BusinessDemo;
  
  // Service Selection
  selectedServices: MenuItem[];
  toggleServiceSelection: (service: MenuItem) => void;
  clearServiceSelection: () => void;
  
  // Computed values
  totalEstimatedDuration: number;
  totalEstimatedPrice: number;

  // Booking State
  bookingState: BeautynspaBookingState;
  setBookingState: (state: BeautynspaBookingState | ((prev: BeautynspaBookingState) => BeautynspaBookingState)) => void;
  updateBookingField: <K extends keyof BeautynspaBookingState>(field: K, value: BeautynspaBookingState[K]) => void;

  // Modals
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;

  // Operational Logic
  isOpenNow: boolean;
}

const BeautynspaContext = createContext<BeautynspaContextType | undefined>(undefined);

export function BeautynspaProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [selectedServices, setSelectedServices] = useState<MenuItem[]>([]);
  const [bookingState, setBookingState] = useState<BeautynspaBookingState>({
    preferredDate: '',
    preferredSession: 'MORNING',
    preferredPractitioner: null,
    referenceLookbook: null,
    customerName: ''
  });
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  const toggleServiceSelection = (service: MenuItem) => {
    setSelectedServices(prev => {
      const exists = prev.find(item => item.id === service.id);
      if (exists) {
        return prev.filter(item => item.id !== service.id);
      } else {
        return [...prev, service];
      }
    });
  };

  const clearServiceSelection = () => {
    setSelectedServices([]);
  };

  const updateBookingField = <K extends keyof BeautynspaBookingState>(field: K, value: BeautynspaBookingState[K]) => {
    setBookingState(prev => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const totalEstimatedDuration = useMemo(() => {
    return selectedServices.reduce((total, service) => total + (service.duration || 30), 0);
  }, [selectedServices]);

  const totalEstimatedPrice = useMemo(() => {
    return selectedServices.reduce((total, service) => {
      const priceVal = parseInt(service.price.replace(/[^0-9]/g, '')) || 0;
      return total + priceVal;
    }, 0);
  }, [selectedServices]);

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

  return (
    <BeautynspaContext.Provider value={{
      client,
      selectedServices,
      toggleServiceSelection,
      clearServiceSelection,
      totalEstimatedDuration,
      totalEstimatedPrice,
      bookingState,
      setBookingState,
      updateBookingField,
      isBookingModalOpen,
      setIsBookingModalOpen,
      isOpenNow
    }}>
      {children}
    </BeautynspaContext.Provider>
  );
}

export function useBeautynspaDemo() {
  const context = useContext(BeautynspaContext);
  if (context === undefined) {
    throw new Error('useBeautynspaDemo must be used within a BeautynspaProvider');
  }
  return context;
}
