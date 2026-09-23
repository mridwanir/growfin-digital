'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { BusinessDemo, MenuItem } from '@/lib/types';

export interface BookingState {
  patientStatus: 'NEW' | 'RETURNING';
  selectedService: MenuItem | null;
  complaint: string;
  preferredDate: string; 
  preferredSession: 'MORNING' | 'AFTERNOON' | 'EVENING';
  patientName: string;
}

interface ClinicDemoContextType {
  client: BusinessDemo;
  
  // Booking State
  bookingState: BookingState;
  setBookingState: (state: BookingState | ((prev: BookingState) => BookingState)) => void;
  updateBookingField: <K extends keyof BookingState>(field: K, value: BookingState[K]) => void;

  // Modals
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;

  // Operational Logic
  isOpenNow: boolean;
}

const ClinicDemoContext = createContext<ClinicDemoContextType | undefined>(undefined);

export function ClinicDemoProvider({ children, client }: { children: ReactNode; client: BusinessDemo }) {
  const [bookingState, setBookingState] = useState<BookingState>({
    patientStatus: 'NEW',
    selectedService: null,
    complaint: '',
    preferredDate: '',
    preferredSession: 'MORNING',
    patientName: ''
  });
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(true);

  const updateBookingField = <K extends keyof BookingState>(field: K, value: BookingState[K]) => {
    setBookingState(prev => ({ ...prev, [field]: value }));
  };

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
    <ClinicDemoContext.Provider value={{
      client,
      bookingState,
      setBookingState,
      updateBookingField,
      isBookingModalOpen,
      setIsBookingModalOpen,
      isOpenNow
    }}>
      {children}
    </ClinicDemoContext.Provider>
  );
}

export function useClinicDemo() {
  const context = useContext(ClinicDemoContext);
  if (context === undefined) {
    throw new Error('useClinicDemo must be used within a ClinicDemoProvider');
  }
  return context;
}
