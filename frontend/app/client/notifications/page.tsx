"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { Music, Bell, User, Check, CreditCard, Star, AlertCircle, Info, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function NotificationsPage() {
  const [filter, setFilter] = useState("all")

  const notifications = [
    {
      id: 1,
      type: "booking_confirmed",
      title: "Booking Confirmed",
      message: "Your booking with Kasun Perera for Wedding Reception has been confirmed.",
      time: "2 hours ago",
      read: false,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      id: 2,
      type: "payment_reminder",
      title: "Payment Due",
      message: "Payment for The Rhythm Band booking is due in 24 hours.",
      time: "4 hours ago",
      read: false,
      icon: CreditCard,
      color: "text-yellow-400",
    },
    {
      id: 3,
      type: "booking_request",
      title: "New Message",
      message: "Nimali Fernando sent you a message about your upcoming event.",
      time: "1 day ago",
      read: true,
      icon: Info,
      color: "text-blue-400",
    },
    {
      id: 4,
      type: "review_reminder",
      title: "Review Reminder",
      message: "Don't forget to review your experience with DJ Saman.",
      time: "2 days ago",
      read: true,
      icon: Star,
      color: "text-yellow-400",
    },
    {
      id: 5,
      type: "booking_cancelled",
      title: "Booking Cancelled",
      message: "Unfortunately, your booking with Ravi Guitar has been cancelled due to artist unavailability.",
      time: "3 days ago",
      read: true,
      icon: AlertCircle,
      color: "text-red-400",
    },
  ]

  const filteredNotifications =
    filter === "all"
      ? notifications
      : filter === "unread"
        ? notifications.filter((n) => !n.read)
        : notifications.filter((n) => n.read)

  const markAsRead = (id: number) => {
    // Implementation would update notification status
    console.log("Mark as read:", id)
  }

  const markAllAsRead = () => {
    // Implementation would mark all as read
    console.log("Mark all as read")
  }

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                <span className="gradient-text">Notifications</span>
              </h1>
              <p className="text-gray/70">Stay updated with your bookings and messages</p>
            </div>

            {/* Filters and Actions */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <Button
                    variant={filter === "all" ? "default" : "ghost"}
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    All ({notifications.length})
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "ghost"}
                    onClick={() => setFilter("unread")}
                    className={filter === "unread" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    Unread ({notifications.filter((n) => !n.read).length})
                  </Button>
                  <Button
                    variant={filter === "read" ? "default" : "ghost"}
                    onClick={() => setFilter("read")}
                    className={filter === "read" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    Read ({notifications.filter((n) => n.read).length})
                  </Button>
                </div>

                <Button
                  variant="outline"
                  onClick={markAllAsRead}
                  className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              </div>
            </Card>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`glass-card p-6 border ${
                    !notification.read ? "border-primary/30 bg-white/10" : "border-white/10"
                  } cursor-pointer hover:bg-white/5 smooth-transition`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center flex-shrink-0`}
                    >
                      <notification.icon className={`w-5 h-5 ${notification.color}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-shadow">{notification.title}</h3>
                        <div className="flex items-center space-x-2">
                          {!notification.read && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                          <span className="text-sm text-gray/60">{notification.time}</span>
                        </div>
                      </div>
                      <p className="text-gray/80 mb-3">{notification.message}</p>

                      {/* Action buttons based on notification type */}
                      <div className="flex space-x-2">
                        {notification.type === "payment_reminder" && (
                          <Button size="sm" className="glow-button">
                            Pay Now
                          </Button>
                        )}
                        {notification.type === "booking_request" && (
                          <Button size="sm" className="glow-button">
                            View Message
                          </Button>
                        )}
                        {notification.type === "review_reminder" && (
                          <Button size="sm" className="glow-button">
                            Leave Review
                          </Button>
                        )}
                        {notification.type === "booking_confirmed" && (
                          <Button size="sm" className="glow-button">
                            View Booking
                          </Button>
                        )}

                        {!notification.read && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              markAsRead(notification.id)
                            }}
                            className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredNotifications.length === 0 && (
              <Card className="glass-card p-12 text-center">
                <Bell className="w-16 h-16 text-gray/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray/70 mb-2">No {filter} notifications</h3>
                <p className="text-gray/50">
                  {filter === "unread"
                    ? "You're all caught up! No new notifications."
                    : filter === "read"
                      ? "No read notifications to show."
                      : "You don't have any notifications yet."}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
