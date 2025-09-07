"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Settings, LogOut } from "lucide-react";
import { NotificationBell } from "./notifications/notification-bell";
import { useAuth } from "@/contexts/auth-context";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const isLinkActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Debug logging
  console.log("[Navigation] Auth state:", {
    isAuthenticated,
    hasUser: !!user,
    userName: user ? `${user.firstName} ${user.lastName}` : "none",
    userEmail: user?.email || "none",
    hasFirstName: !!user?.firstName,
    hasLastName: !!user?.lastName,
  });

  const getRoleBasedLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case "client":
        return [
          { href: "/client/search", label: "Search Artists" },
          { href: "/client/dashboard", label: "Dashboard" },
          { href: "/client/bookings", label: "My Bookings" },
          { href: "/client/notifications", label: "Notifications" },
        ];
      case "performer":
        return [
          { href: "/performer/dashboard", label: "Dashboard" },
          { href: "/performer/profile", label: "My Profile" },
          { href: "/performer/bookings", label: "Bookings" },
          { href: "/performer/earnings", label: "Earnings" },
        ];
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Dashboard" },
          { href: "/admin/performers", label: "Performers" },
          { href: "/admin/bookings", label: "Bookings" },
          { href: "/admin/analytics", label: "Analytics" },
        ];
      default:
        return [];
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/20 backdrop-blur-3xl border-b border-white/30 shadow-xl shadow-red-500/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-gray font-bold text-sm">SN</span>
            </div>
            <span className="text-gray-900 font-bold text-xl">StarNet</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isHomePage && (
              <Link
                href="/browse"
                className={`text-gray-800 hover:text-red-600 transition-colors font-medium ${
                  isLinkActive("/browse") ? "text-red-600 underline underline-offset-8 decoration-2" : ""
                }`}
              >
                Browse Artists
              </Link>
            )}
            {getRoleBasedLinks().map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-gray-800 hover:text-red-600 transition-colors font-medium ${
                  isLinkActive(link.href) ? "text-red-600 underline underline-offset-8 decoration-2" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <NotificationBell />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-gray-800 hover:text-red-600 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center text-white text-sm font-bold">
                      {(user.firstName || "U").charAt(0).toUpperCase()}
                      {(user.lastName || "U").charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden md:block font-medium">
                      {user.firstName || "User"} {user.lastName || ""}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white/90 backdrop-blur-xl border border-white/50 rounded-xl shadow-2xl shadow-red-500/10 z-50">
                        <div className="p-2">
                          <Link
                            href={`/${user.role}/profile`}
                            className={`flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all ${
                              isLinkActive(`/${user.role}/profile`) ? "text-red-600 font-medium" : ""
                            }`}
                          >
                            <User className="w-4 h-4" />
                            Profile
                          </Link>
                          <Link
                            href={`/${user.role}/settings`}
                            className={`flex items-center gap-2 px-3 py-2 text-gray-800 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all ${
                              isLinkActive(`/${user.role}/settings`) ? "text-red-600 font-medium" : ""
                            }`}
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                          <hr className="my-2 border-gray-300/50" />
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              /* Authentication Links */
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className={`text-gray-800 hover:text-red-600 transition-colors font-medium ${
                    isLinkActive("/login") ? "text-red-600 underline underline-offset-8 decoration-2" : ""
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-800 hover:text-red-600 transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/30 py-4">
            <div className="space-y-2">
              {isHomePage && (
                <Link
                  href="/browse"
                  className={`block px-4 py-2 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all ${
                    isLinkActive("/browse") ? "text-red-600 underline underline-offset-4 decoration-2" : "text-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  Browse Artists
                </Link>
              )}
              {isAuthenticated && user ? (
                <>
                  {getRoleBasedLinks().map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all ${
                        isLinkActive(link.href) ? "text-red-600 underline underline-offset-4 decoration-2" : "text-gray-800"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <hr className="my-2 border-gray-300/50" />
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50/50 rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`block px-4 py-2 hover:text-red-600 hover:bg-red-50/50 rounded-lg transition-all ${
                      isLinkActive("/login") ? "text-red-600 underline underline-offset-4 decoration-2" : "text-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="block px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}