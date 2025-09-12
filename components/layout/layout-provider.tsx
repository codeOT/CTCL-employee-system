"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"







type LayoutContextType = {


  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void

  darkMode: boolean
  setDarkMode: (dark: boolean) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)


export function LayoutProvider({ children }: { children: ReactNode }) {
 

 

  

  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth >= 768
    }
    return true
  })


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


export function useLayout() {
  const context = useContext(LayoutContext)
  if (context === undefined) {
    throw new Error("useLayout must be used within a LayoutProvider")
  }
  return context
}
