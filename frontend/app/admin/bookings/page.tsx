"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import {
  Shield,
  Search,
  Filter,
  Bell,
  Settings,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const bookings = [
    {
      id: 1,
      client: "John Doe",
      performer: "Kasun Perera",
      event: "Wedding Reception",
      date: "2024-01-15",
      time: "7:00 PM",
      location: "Colombo",
      amount: "LKR 25,000",
      status: "confirmed",
      bookingDate: "2024-01-01",
      commission: "LKR 2,500",
    },
    {
      id: 2,
      client: "Sarah Silva",
      performer: "The Rhythm Band",
      event: "Corporate Event",
      date: "2024-01-22",
      time: "6:30 PM",
      location: "Kandy",
      amount: "LKR 75,000",
      status: "pending",
      bookingDate: "2024-01-05",
      commission: "LKR 7,500",
    },
    {
      id: 3,
      client: "Mike Fernando",
      performer: "Nimali Fernando",
      event: "Birthday Party",
      date: "2024-01-18",
      time: "8:00 PM",
      location: "Galle",
      amount: "LKR 20,000",
      status: "completed",
      bookingDate: "2024-01-03",
      commission: "LKR 2,000",
    },
    {
      id: 4,
      client: "Lisa Perera",
      performer: "DJ Saman",
      event: "Anniversary Celebration",
      date: "2024-01-20",
      time: "7:30 PM",
      location: "Negombo",
      amount: "LKR 30,000",
      status: "disputed",
      bookingDate: "2024-01-02",
      commission: "LKR 3,000",
    },
    {
      id: 5,
      client: "David Silva",
      performer: "Ravi Guitar",
      event: "Restaurant Performance",
      date: "2024-01-25",
      time: "6:00 PM",
      location: "Colombo",
      amount: "LKR 15,000",
      status: "cancelled",
      bookingDate: "2024-01-04",
      commission: "LKR 0",
    },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "disputed", label: "Disputed" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-blue-500/20 text-blue-400"
      case "cancelled":
        return "bg-gray-500/20 text-gray-400"
      case "disputed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return CheckCircle
      case "pending":
        return Clock
      case "completed":
        return CheckCircle
      case "cancelled":
        return XCircle
      case "disputed":
        return AlertTriangle
      default:
        return Clock
    }
  }

  const filteredBookings = statusFilter === "all" ? bookings : bookings.filter((b) => b.status === statusFilter)

  const totalRevenue = bookings.reduce((sum, booking) => {
    if (booking.status === "completed") {
      return sum + Number.parseInt(booking.amount.replace(/[^\d]/g, ""))
    }
    return sum
  }, 0)

  const totalCommission = bookings.reduce((sum, booking) => {
    if (booking.status === "completed") {
      return sum + Number.parseInt(booking.commission.replace(/[^\d]/g, ""))
    }
    return sum
  }, 0)

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Bookings <span className="gradient-text">Overview</span>
              </h1>
              <p className="text-gray/70">Monitor and manage all platform bookings</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Total Bookings</p>
                    <p className="text-2xl font-bold text-shadow">{bookings.length}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-shadow">LKR {totalRevenue.toLocaleString()}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Commission Earned</p>
                    <p className="text-2xl font-bold text-shadow">LKR {totalCommission.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Disputes</p>
                    <p className="text-2xl font-bold text-shadow">
                      {bookings.filter((b) => b.status === "disputed").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray/50" />
                  <Input
                    placeholder="Search bookings by client, performer, or event..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card bg-white/5 border-white/20 text-gray placeholder:text-gray/50 focus:border-primary/50"
                  />
                </div>
                <Button
                  variant="outline"
                  className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={statusFilter === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(option.value)}
                    className={
                      statusFilter === option.value
                        ? "glow-button"
                        : "glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Bookings List */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-shadow">Bookings ({filteredBookings.length})</h2>
                <Button className="glow-button">Export Data</Button>
              </div>

              <div className="space-y-4">
                {filteredBookings.map((booking) => {
                  const StatusIcon = getStatusIcon(booking.status)
                  return (
                    <Card key={booking.id} className="glass-card p-6 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <h3 className="text-xl font-semibold text-shadow">#{booking.id}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {booking.status}
                            </Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray/60 text-sm">Client</p>
                              <p className="font-medium text-shadow">{booking.client}</p>
                            </div>
                            <div>
                              <p className="text-gray/60 text-sm">Performer</p>
                              <p className="font-medium text-shadow">{booking.performer}</p>
                            </div>
                            <div>
                              <p className="text-gray/60 text-sm">Event</p>
                              <p className="font-medium text-shadow">{booking.event}</p>
                            </div>
                            <div>
                              <p className="text-gray/60 text-sm">Booking Date</p>
                              <p className="font-medium text-shadow">{booking.bookingDate}</p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 text-sm text-gray/60 mb-4">
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

                          <div className="flex items-center space-x-6 text-sm">
                            <div>
                              <p className="text-gray/60">Amount</p>
                              <p className="font-semibold gradient-text">{booking.amount}</p>
                            </div>
                            <div>
                              <p className="text-gray/60">Commission</p>
                              <p className="font-semibold text-green-400">{booking.commission}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                          {booking.status === "disputed" && (
                            <Button size="sm" className="glow-button">
                              Resolve Dispute
                            </Button>
                          )}
                          {booking.status === "pending" && (
                            <Button size="sm" className="glow-button">
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray/70 mb-2">No bookings found</h3>
                  <p className="text-gray/50">Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
