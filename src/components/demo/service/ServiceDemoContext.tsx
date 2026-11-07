'use client'

import type { BusinessDemo, MenuItem } from '@/lib/types'

import { createContext, useContext, useState, type ReactNode, useEffect } from 'react'

export interface BookingState {
  patientStatus: 'NEW' | 'RETURNING'
  selectedService: MenuItem | null
  complaint: string
  preferredDate: string
  preferredSession: 'MORNING' | 'AFTERNOON' | 'EVENING'
  patientName: string
}

interface ServiceDemoContextType {
  client: BusinessDemo

  // Booking State
  bookingState: BookingState
  setBookingState: (state: BookingState | ((prev: BookingState) => BookingState)) => void
  updateBookingField: <K extends keyof BookingState>(field: K, value: BookingState[K]) => void

  // Modals
  isBookingModalOpen: boolean
  setIsBookingModalOpen: (open: boolean) => void

  // Operational Logic
  isOpenNow: boolean
  selectedService: MenuItem | null
  setSelectedService: (service: MenuItem | null) => void
  chatMessage: string
  setChatMessage: (msg: string) => void
  chatHistory: any[]
  isDoctorTyping: boolean
  handleSendMessage: () => void
  setIsScheduleModalOpen: (open: boolean) => void
  serviceTerminology: any
  selectedDay: string
  selectedTime: string
  searchQuery: string
  setSearchQuery: (q: string) => void
  selectedCategory: string
  setSelectedCategory: (cat: string) => void
}

const ServiceDemoContext = createContext<ServiceDemoContextType | undefined>(undefined)

export function ServiceDemoProvider({
  children,
  client,
}: {
  children: ReactNode
  client: BusinessDemo
}) {
  const [bookingState, setBookingState] = useState<BookingState>({
    patientStatus: 'NEW',
    selectedService: null,
    complaint: '',
    preferredDate: '',
    preferredSession: 'MORNING',
    patientName: '',
  })

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [isOpenNow, setIsOpenNow] = useState(client.isOpen !== false)
  const [selectedService, setSelectedService] = useState<MenuItem | null>(null)
  const [chatMessage, setChatMessage] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [isDoctorTyping, setIsDoctorTyping] = useState(false)
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Semua')

  const handleSendMessage = () => {}

  const updateBookingField = <K extends keyof BookingState>(field: K, value: BookingState[K]) => {
    setBookingState(prev => ({ ...prev, [field]: value }))
  }

  // Parse open/close times to calculate if open now
  useEffect(() => {
    if (client.isOpen === false) {
      setIsOpenNow(false)
      return
    }

    if (client.openTime && client.closeTime) {
      const checkIsOpen = () => {
        if (client.isOpen === false) {
          setIsOpenNow(false)
          return
        }

        const now = new Date()
        const currentHours = now.getHours()
        const currentMinutes = now.getMinutes()
        const currentTime = currentHours * 60 + currentMinutes

        const [openHour, openMin] = client.openTime!.split(':').map(Number)
        const [closeHour, closeMin] = client.closeTime!.split(':').map(Number)

        const openTime = openHour * 60 + openMin
        let closeTime = closeHour * 60 + closeMin

        if (closeTime < openTime) {
          if (currentTime >= openTime || currentTime < closeTime) {
            setIsOpenNow(true)
            return
          }
        } else {
          if (currentTime >= openTime && currentTime < closeTime) {
            setIsOpenNow(true)
            return
          }
        }
        setIsOpenNow(false)
      }

      checkIsOpen()
      const interval = setInterval(checkIsOpen, 60000)
      return () => clearInterval(interval)
    } else {
      setIsOpenNow(true)
    }
  }, [client.isOpen, client.openTime, client.closeTime])

  return (
    <ServiceDemoContext.Provider
      value={{
        client,
        bookingState,
        setBookingState,
        updateBookingField,
        isBookingModalOpen,
        setIsBookingModalOpen,
        isOpenNow,
        selectedService,
        setSelectedService,
        chatMessage,
        setChatMessage,
        chatHistory,
        isDoctorTyping,
        handleSendMessage,
        setIsScheduleModalOpen,
        serviceTerminology: {},
        selectedDay: '',
        selectedTime: '',
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </ServiceDemoContext.Provider>
  )
}

export function useServiceDemo() {
  const context = useContext(ServiceDemoContext)
  if (context === undefined) {
    throw new Error('useServiceDemo must be used within a ServiceDemoProvider')
  }
  return context
}
