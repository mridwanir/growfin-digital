'use client'

import type { BusinessDemo, MenuItem } from '@/lib/types'

import { createContext, useContext, useState } from 'react'

interface GroomingDemoContextType {
  client: BusinessDemo
  isBookingModalOpen: boolean
  setIsBookingModalOpen: (open: boolean) => void
  selectedTreatment: string
  setSelectedTreatment: (treatment: string) => void
  selectedStylist: string
  setSelectedStylist: (stylist: string) => void
  selectedServices: MenuItem[]
  toggleServiceSelection: (service: MenuItem) => void
  updateBookingField: (field: string, value: any) => void
}

const GroomingDemoContext = createContext<GroomingDemoContextType | undefined>(undefined)

export function GroomingDemoProvider({
  client,
  children,
}: {
  client: BusinessDemo
  children: React.ReactNode
}) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [selectedTreatment, setSelectedTreatment] = useState<string>('')
  const [selectedStylist, setSelectedStylist] = useState<string>('')
  const [selectedServices, setSelectedServices] = useState<MenuItem[]>([])

  const toggleServiceSelection = (service: MenuItem) => {
    setSelectedServices(prev =>
      prev.some(s => s.id === service.id)
        ? prev.filter(s => s.id !== service.id)
        : [...prev, service],
    )
  }

  const updateBookingField = (_field: string, _value: any) => {}

  return (
    <GroomingDemoContext.Provider
      value={{
        client,
        isBookingModalOpen,
        setIsBookingModalOpen,
        selectedTreatment,
        setSelectedTreatment,
        selectedStylist,
        setSelectedStylist,
        selectedServices,
        toggleServiceSelection,
        updateBookingField,
      }}
    >
      {children}
    </GroomingDemoContext.Provider>
  )
}

export function useGroomingDemo() {
  const context = useContext(GroomingDemoContext)
  if (!context) {
    throw new Error('useGroomingDemo must be used within a GroomingDemoProvider')
  }
  return context
}
