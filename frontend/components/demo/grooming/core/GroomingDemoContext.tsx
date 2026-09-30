'use client';

import { createContext, useContext, useState } from 'react';
import { BusinessDemo } from '@/lib/types';

interface GroomingDemoContextType {
  client: BusinessDemo;
  isBookingModalOpen: boolean;
  setIsBookingModalOpen: (open: boolean) => void;
  selectedTreatment: string;
  setSelectedTreatment: (treatment: string) => void;
  selectedStylist: string;
  setSelectedStylist: (stylist: string) => void;
}

const GroomingDemoContext = createContext<GroomingDemoContextType | undefined>(undefined);

export function GroomingDemoProvider({ client, children }: { client: BusinessDemo, children: React.ReactNode }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState<string>('');
  const [selectedStylist, setSelectedStylist] = useState<string>('');

  return (
    <GroomingDemoContext.Provider value={{
      client,
      isBookingModalOpen,
      setIsBookingModalOpen,
      selectedTreatment,
      setSelectedTreatment,
      selectedStylist,
      setSelectedStylist
    }}>
      {children}
    </GroomingDemoContext.Provider>
  );
}

export function useGroomingDemo() {
  const context = useContext(GroomingDemoContext);
  if (!context) {
    throw new Error('useGroomingDemo must be used within a GroomingDemoProvider');
  }
  return context;
}
