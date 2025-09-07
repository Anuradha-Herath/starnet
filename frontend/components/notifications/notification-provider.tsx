"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import { Bell, CheckCircle, AlertCircle, Clock, DollarSign, Star } from "lucide-react"

export interface Notification {
  id: string
  type: "booking" | "payment" | "review" | "system" | "approval"
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: "low" | "medium" | "high"
  actionUrl?: string
  metadata?: Record<string, any>
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "booking",
      title: "New Booking Request",
      message: "Kasun Perera wants to book you for a wedding ceremony on Dec 25th",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      priority: "high",
      actionUrl: "/performer/bookings",
    },
    {
      id: "2",
      type: "payment",
      title: "Payment Received",
      message: "You received LKR 25,000 for your performance at Galle Face Hotel",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: false,
      priority: "medium",
      actionUrl: "/performer/earnings",
    },
    {
      id: "3",
      type: "review",
      title: "New Review",
      message: 'Priya Silva left you a 5-star review: "Amazing performance!"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      priority: "low",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

export function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "booking":
      return Clock
    case "payment":
      return DollarSign
    case "review":
      return Star
    case "approval":
      return CheckCircle
    case "system":
      return AlertCircle
    default:
      return Bell
  }
}
