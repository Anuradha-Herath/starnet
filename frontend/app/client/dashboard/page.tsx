"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import {
  Calendar,
  Search,
  Bell,
  User,
  CreditCard,
  Star,
  Clock,
  MapPin,
  Music,
  TrendingUp,
  Heart,
  Settings,
} from "lucide-react"
import Link from "next/link"

export default function ClientDashboard() {
  return (
    <RedirectGuard allowedRoles={["client"]}>
      <ClientDashboardContent />
    </RedirectGuard>
  )
}

function ClientDashboardContent() {
  const upcomingBookings = [
    {
      id: 1,
      artist: "Kasun Perera",
      event: "Wedding Reception",
      date: "2024-01-15",
      time: "7:00 PM",
      location: "Colombo",
      status: "confirmed",
      amount: "LKR 25,000",
    },
    {
      id: 2,
      artist: "The Rhythm Band",
      event: "Corporate Event",
      date: "2024-01-22",
      time: "6:30 PM",
      location: "Kandy",
      status: "pending",
      amount: "LKR 75,000",
    },
  ]

  const recentActivity = [
    { type: "booking", message: "Booking confirmed for Kasun Perera", time: "2 hours ago" },
    { type: "payment", message: "Payment processed for The Rhythm Band", time: "1 day ago" },
    { type: "review", message: "Review submitted for Nimali Fernando", time: "3 days ago" },
  ]

  const stats = [
    { label: "Total Bookings", value: "12", icon: Calendar, color: "text-blue-400" },
    { label: "This Month", value: "3", icon: TrendingUp, color: "text-green-400" },
    { label: "Favorites", value: "8", icon: Heart, color: "text-red-400" },
    { label: "Reviews Given", value: "9", icon: Star, color: "text-yellow-400" },
  ]

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                Welcome back, <span className="gradient-text">John!</span>
              </h1>
              <p className="text-gray-600">Manage your bookings and discover new artists</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Upcoming Bookings */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Upcoming Bookings</h2>
                    <Link href="/client/bookings">
                      <Button variant="ghost" className="text-primary hover:bg-gray-100">
                        View All
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="glass-card p-4 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{booking.artist}</h3>
                              <Badge
                                className={
                                  booking.status === "confirmed"
                                    ? "bg-green-500/20 text-green-700"
                                    : "bg-yellow-500/20 text-yellow-700"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{booking.event}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {booking.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {booking.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {booking.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold gradient-text">{booking.amount}</p>
                            <Button size="sm" className="mt-2 glow-button">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Recent Activity */}
              <div>
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-gray-900">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-800 text-sm">{activity.message}</p>
                          <p className="text-gray-500 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommended Artists */}
                <Card className="glass-card p-6 mt-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Recommended</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src="/sri-lankan-female-singer.png"
                        alt="Artist"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Chamari Voice</p>
                        <p className="text-sm text-gray-500">Singer • Matara</p>
                      </div>
                      <Button size="sm" className="glow-button">
                        View
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <img src="/sri-lankan-dj.png" alt="Artist" className="w-12 h-12 rounded-full object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">DJ Saman</p>
                        <p className="text-sm text-gray-500">DJ • Colombo</p>
                      </div>
                      <Button size="sm" className="glow-button">
                        View
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
