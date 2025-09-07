"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Music, Menu, X, Bell, User, LogOut, Settings } from "lucide-react"
import { useAuth } from "@/contexts/asgardeo-auth-context"

export function AsgardeoNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const getUserInitials = (user: any) => {
    if (!user) return "U"
    
    const firstName = user.given_name || user.name?.split(' ')[0] || ''
    const lastName = user.family_name || user.name?.split(' ')[1] || ''
    
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase()
    } else if (user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return "U"
  }

  const getUserRole = (user: any) => {
    return user?.groups?.[0] || 'user'
  }

  const getUserDisplayName = (user: any) => {
    return user?.name || user?.given_name || user?.email?.split('@')[0] || 'User'
  }

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">StarNet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/browse"
              className="text-gray-700 hover:text-primary smooth-transition font-medium"
            >
              Browse Artists
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-primary smooth-transition font-medium"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-primary smooth-transition font-medium"
            >
              Contact
            </Link>

            {/* Auth Section */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
                </Button>

                {/* User Menu */}
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {getUserInitials(user)}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {getUserDisplayName(user)}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {getUserRole(user)}
                      </Badge>
                    </div>
                  </Button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-200">
                    <div className="py-1">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/asgardeo-login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-gradient-to-r from-primary to-primary-light">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link
                href="/browse"
                className="text-gray-700 hover:text-primary smooth-transition font-medium px-2 py-1"
                onClick={closeMenu}
              >
                Browse Artists
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-primary smooth-transition font-medium px-2 py-1"
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary smooth-transition font-medium px-2 py-1"
                onClick={closeMenu}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 pt-3 mt-3">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                        {getUserInitials(user)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {getUserDisplayName(user)}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {getUserRole(user)}
                        </Badge>
                      </div>
                    </div>
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-primary smooth-transition"
                      onClick={closeMenu}
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        closeMenu()
                      }}
                      className="flex items-center space-x-3 px-2 py-2 text-gray-700 hover:text-primary smooth-transition w-full text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link href="/asgardeo-login" onClick={closeMenu}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={closeMenu}>
                      <Button size="sm" className="w-full bg-gradient-to-r from-primary to-primary-light">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
