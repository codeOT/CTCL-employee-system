"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define types for our data
export type Employee = {
  id: string
  name: string
  employeeId: string
  position: string
  department: string
  email: string
  phone: string
  joinDate: string
  status: string
  avatar: string
  [key: string]: any // Allow additional properties
}

export type LeaveRequest = {
  id: string
  employeeId: string
  employeeName: string
  leaveType: string
  startDate: string
  endDate: string
  days: number
  reason: string
  status: string
}

export type Project = {
  id: string
  name: string
  client: string
  startDate: string
  deadline: string
  team: string[]
  progress: number
  status: string
}

export type Attendance = {
  id: string
  employeeId: string
  employeeName: string
  date: string
  checkIn: string
  checkOut: string
  checkInStatus: string
  checkOutStatus: string
  workingHours: string
  status: string
}

// Define the context type
type LayoutContextType = {


  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

// Create the context
const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

// Create a provider component
export function LayoutProvider({ children }: { children: ReactNode }) {
 

 

  

  // Initialize sidebar state based on screen size
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768
    }
    return true
  })

  // Initialize dark mode from localStorage or system preference
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const savedMode = localStorage.getItem("darkMode")
      if (savedMode !== null) {
        return savedMode === "true"
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    return false
  })



  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", darkMode.toString())
    }
  }, [darkMode])

  // CRUD operations for employees


  return (
    <LayoutContext.Provider
      value={{
       

        sidebarOpen,
        setSidebarOpen,

        darkMode,
        setDarkMode,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}

// Create a custom hook to use the context
export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
