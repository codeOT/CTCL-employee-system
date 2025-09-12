"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Moon, User, LogOut, Settings, HelpCircle, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLayout } from "@/components/layout/layout-provider"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { signOut } from "next-auth/react"
import Link from "next/link"

export function AppHeader() {
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme } = useTheme()
  const { sidebarOpen, setSidebarOpen, setDarkMode } = useLayout()
  const { toast } = useToast()

  const handleThemeToggle = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    setDarkMode(newTheme === "dark")
    toast({
      title: `${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)} mode activated`,
      description: `You've switched to ${newTheme} mode.`,
    })
  }

  const handleLogout = async () => {
    try {
      // Call our custom logout API first to reset approval status
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Include cookies
      });
      
      // Then use NextAuth signOut
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback to NextAuth signOut even if our API fails
      await signOut({
        callbackUrl: "/login",
        redirect: true,
      });
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="w-full flex items-center justify-between">
        <div className="relative w-full max-w-md">
          
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2">
            <Label htmlFor="theme-mode" className="text-sm">
              Dark Mode
            </Label>
            <Switch id="theme-mode" checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
          </div>

       

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full">
                <User className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <Link href="/dashboard/settings">
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
             
              <DropdownMenuSeparator />
              <DropdownMenuItem className="md:hidden cursor-pointer">
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark Mode</span>
                <div className="ml-auto">
                  <Switch checked={theme === "dark"} onCheckedChange={handleThemeToggle} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="md:hidden" />
              <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
