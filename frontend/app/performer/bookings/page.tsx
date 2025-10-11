"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { Navigation } from "@/components/navigation"
import {
  Music,
  Calendar,
  Clock,
  MapPin,
  Bell,
  User,
  Filter,
  MessageCircle,
  Check,
  X,
  Eye,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PerformerBookingsPage() {
  const [activeTab, setActiveTab] = useState("requests")

  const bookings = {
    requests: [
      {
        id: 1,
        client: "John Doe",
        clientImage: "/placeholder.svg?height=40&width=40",
        event: "Wedding Reception",
        date: "2024-01-15",
        time: "7:00 PM",
        location: "Colombo",
        budget: "LKR 25,000",
        status: "pending",
        requestDate: "2024-01-01",
        description:
          "Looking for a singer for our wedding reception. We'd love some classic Sinhala songs and English hits.",
        guestCount: 150,
        duration: "3 hours",
      },
      {
        id: 2,
        client: "Sarah Silva",
        clientImage: "/placeholder.svg?height=40&width=40",
        event: "Corporate Event",
        date: "2024-01-22",
        time: "6:30 PM",
        location: "Kandy",
        budget: "LKR 30,000",
        status: "pending",
        requestDate: "2024-01-03",
        description: "Annual company dinner. Need entertainment for about 2 hours.",
        guestCount: 80,
        duration: "2 hours",
      },
    ],
    upcoming: [
      {
        id: 3,
        client: "Mike Fernando",
        clientImage: "/placeholder.svg?height=40&width=40",
        event: "Birthday Party",
        date: "2024-01-18",
        time: "8:00 PM",
        location: "Galle",
        amount: "LKR 20,000",
        status: "confirmed",
        confirmedDate: "2024-01-05",
        duration: "2 hours",
        guestCount: 50,
      },
    ],
    completed: [
      {
        id: 4,
        client: "Lisa Perera",
        clientImage: "/placeholder.svg?height=40&width=40",
        event: "Anniversary Celebration",
        date: "2023-12-20",
        time: "7:30 PM",
        location: "Negombo",
        amount: "LKR 22,000",
        status: "completed",
        rating: 5,
        review: "Amazing performance! Kasun made our anniversary unforgettable.",
        duration: "2.5 hours",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
  return "bg-yellow-100/80 text-yellow-800"
      case "confirmed":
  return "bg-green-100/80 text-green-800"
      case "completed":
  return "bg-blue-100/80 text-blue-800"
      case "cancelled":
  return "bg-red-100/80 text-red-800"
      default:
  return "bg-gray-100/80 text-gray-800"
    }
  }

  return (
    <AuthGuard requiredRole="performer">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                My <span className="gradient-text">Bookings</span>
              </h1>
              <p className="text-gray/70">Manage your booking requests and upcoming performances</p>
            </div>

            {/* Tabs */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-4">
                  <Button
                    variant={activeTab === "requests" ? "default" : "ghost"}
                    onClick={() => setActiveTab("requests")}
                    className={activeTab === "requests" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    Requests ({bookings.requests.length})
                  </Button>
                  <Button
                    variant={activeTab === "upcoming" ? "default" : "ghost"}
                    onClick={() => setActiveTab("upcoming")}
                    className={activeTab === "upcoming" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    Upcoming ({bookings.upcoming.length})
                  </Button>
                  <Button
                    variant={activeTab === "completed" ? "default" : "ghost"}
                    onClick={() => setActiveTab("completed")}
                    className={activeTab === "completed" ? "glow-button" : "text-gray/70 hover:text-gray"}
                  >
                    Completed ({bookings.completed.length})
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
                          src={booking.clientImage || "/placeholder.svg"}
                          alt={booking.client}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-xl font-semibold text-shadow">{booking.client}</h3>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </div>
                          <p className="text-gray/70 mb-2 font-medium">{booking.event}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray/60 mb-3">
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

                          {/* Additional Details */}
                          <div className="flex items-center space-x-4 text-sm text-gray/60">
                            {"duration" in booking && <span>Duration: {booking.duration}</span>}
                            {"guestCount" in booking && <span>Guests: {booking.guestCount}</span>}
                          </div>

                          {/* Description for requests */}
                          {"description" in booking && (
                            <p className="text-gray/80 mt-3 text-sm bg-white/5 p-3 rounded-lg">
                              {booking.description}
                            </p>
                          )}

                          {/* Review for completed */}
                          {"review" in booking && (
                            <div className="mt-3 bg-white/5 p-3 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-4 h-4 ${i < booking.rating! ? "text-yellow-400" : "text-gray/30"}`}
                                    >
                                      ★
                                    </div>
                                  ))}
                                </div>
                                <span className="text-sm text-gray/60">Client Review</span>
                              </div>
                              <p className="text-gray/80 text-sm">{booking.review}</p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold gradient-text">
                          {"budget" in booking ? booking.budget : booking.amount}
                        </p>
                        {"requestDate" in booking && (
                          <p className="text-sm text-gray/60">Requested {booking.requestDate}</p>
                        )}
                        {"confirmedDate" in booking && (
                          <p className="text-sm text-gray/60">Confirmed {booking.confirmedDate}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message Client
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
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
                              <X className="w-4 h-4 mr-2" />
                              Decline
                            </Button>
                            <Button size="sm" className="glow-button">
                              <Check className="w-4 h-4 mr-2" />
                              Accept
                            </Button>
                          </>
                        )}
                        {booking.status === "confirmed" && (
                          <Button size="sm" className="glow-button">
                            <Calendar className="w-4 h-4 mr-2" />
                            Event Details
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button size="sm" className="glow-button">
                            <DollarSign className="w-4 h-4 mr-2" />
                            View Payment
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {bookings[activeTab as keyof typeof bookings].length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray/70 mb-2">No {activeTab} bookings</h3>
                  <p className="text-gray/50 mb-6">
                    {activeTab === "requests"
                      ? "You don't have any pending requests at the moment."
                      : activeTab === "upcoming"
                        ? "No upcoming performances scheduled."
                        : "No completed bookings to show."}
                  </p>
                  {activeTab === "requests" && (
                    <Link href="/performer/profile">
                      <Button className="glow-button">Update Your Profile</Button>
                    </Link>
                  )}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
