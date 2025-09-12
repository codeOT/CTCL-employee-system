import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { LayoutProvider } from "@/components/layout/layout-provider"
import NextAuthProvider from "@/components/session-provider" 

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Employee Management System",
  description: "Advanced employee management system built with Next.js",
  generator: "OTD",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextAuthProvider>  
          <LayoutProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </LayoutProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
