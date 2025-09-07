"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import {
  Music,
  Calendar,
  Clock,
  MapPin,
  Star,
  Bell,
  User,
  Filter,
  Download,
  MessageCircle,
  CreditCard,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MyBookingsPage() {
  return (
    <RedirectGuard allowedRoles={["client"]}>
      <MyBookingsContent />
    </RedirectGuard>
  )
}

function MyBookingsContent() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const bookings = {
    upcoming: [
      {
        id: 1,
        artist: "Kasun Perera",
        artistImage: "/sri-lankan-male-singer.png",
        event: "Wedding Reception",
        date: "2024-01-15",
        time: "7:00 PM",
        location: "Colombo",
        status: "confirmed",
        amount: "LKR 25,000",
        paymentStatus: "paid",
        bookingDate: "2024-01-01",
      },
      {
        id: 2,
        artist: "The Rhythm Band",
        artistImage: "/sri-lankan-music-band.png",
        event: "Corporate Event",
        date: "2024-01-22",
        time: "6:30 PM",
        location: "Kandy",
        status: "pending",
        amount: "LKR 75,000",
        paymentStatus: "pending",
        bookingDate: "2024-01-05",
      },
    ],
    past: [
      {
        id: 3,
        artist: "Nimali Fernando",
        artistImage: "/sri-lankan-dancer.png",
        event: "Cultural Festival",
        date: "2023-12-20",
        time: "5:00 PM",
        location: "Kandy",
        status: "completed",
        amount: "LKR 20,000",
        paymentStatus: "paid",
        bookingDate: "2023-12-01",
        rating: 5,
        reviewed: true,
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "completed":
        return "bg-blue-500/20 text-blue-400"
      case "cancelled":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "failed":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                My <span className="gradient-text">Bookings</span>
              </h1>
              <p className="text-gray-700">Manage your current and past bookings</p>
            </div>

            {/* Tabs */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-4">
                  <Button
                    variant={activeTab === "upcoming" ? "default" : "ghost"}
                    onClick={() => setActiveTab("upcoming")}
                    className={activeTab === "upcoming" ? "glow-button" : "text-gray-700 hover:text-gray-900"}
                  >
                    Upcoming ({bookings.upcoming.length})
                  </Button>
                  <Button
                    variant={activeTab === "past" ? "default" : "ghost"}
                    onClick={() => setActiveTab("past")}
                    className={activeTab === "past" ? "glow-button" : "text-gray-700 hover:text-gray-900"}
                  >
                    Past ({bookings.past.length})
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Bookings List */}
              <div className="space-y-6">
                {bookings[activeTab as keyof typeof bookings].map((booking) => (
                  <Card key={booking.id} className="glass-card p-6 border border-white/10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.artistImage || "/placeholder.svg"}
                          alt={booking.artist}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-semibold text-shadow mb-1">{booking.artist}</h3>
                          <p className="text-gray-700 mb-2">{booking.event}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
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
                      </div>

                      <div className="text-right">
                        <div className="flex space-x-2 mb-2">
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                            {booking.paymentStatus}
                          </Badge>
                        </div>
                        <p className="text-lg font-semibold gradient-text">{booking.amount}</p>
                        <p className="text-sm text-gray-600">Booked on {booking.bookingDate}</p>
                      </div>
                    </div>

                    {/* Past booking rating */}
                    {booking.status === "completed" && "rating" in booking && (
                      <div className="flex items-center space-x-2 mb-4">
                        <span className="text-sm text-gray-600">Your rating:</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < booking.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {booking.reviewed && <Badge className="bg-blue-500/20 text-blue-400 text-xs">Reviewed</Badge>}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-gray-200 text-gray-900 hover:bg-gray-100 bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact Artist
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-gray-200 text-gray-900 hover:bg-gray-100 bg-transparent"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Invoice
                        </Button>
                      </div>

                      <div className="flex space-x-2">
                        {booking.status === "pending" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="glass-card border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                            >
                              Cancel
                            </Button>
                            {booking.paymentStatus === "pending" && (
                              <Button size="sm" className="glow-button">
                                <CreditCard className="w-4 h-4 mr-2" />
                                Pay Now
                              </Button>
                            )}
                          </>
                        )}
                        {booking.status === "completed" && !("reviewed" in booking && booking.reviewed) && (
                          <Button size="sm" className="glow-button">
                            <Star className="w-4 h-4 mr-2" />
                            Leave Review
                          </Button>
                        )}
                        <Button size="sm" className="glow-button">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {bookings[activeTab as keyof typeof bookings].length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No {activeTab} bookings</h3>
                  <p className="text-gray-400 mb-6">
                    {activeTab === "upcoming"
                      ? "You don't have any upcoming bookings yet."
                      : "You haven't completed any bookings yet."}
                  </p>
                  <Link href="/client/search">
                    <Button className="glow-button">Find Artists</Button>
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
