"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/auth/RedirectGuard"
import {
  Calendar,
  DollarSign,
  Star,
  Bell,
  User,
  TrendingUp,
  Clock,
  MapPin,
  Music,
  Eye,
  MessageCircle,
  Settings,
  Camera,
} from "lucide-react"
import Link from "next/link"

export default function PerformerDashboard() {
  return (
    <RedirectGuard allowedRoles={["performer"]}>
      <PerformerDashboardContent />
    </RedirectGuard>
  )
}

function PerformerDashboardContent() {
  const pendingRequests = [
    {
      id: 1,
      client: "John Doe",
      event: "Wedding Reception",
      date: "2024-01-15",
      time: "7:00 PM",
      location: "Colombo",
      budget: "LKR 25,000",
      status: "pending",
      requestDate: "2024-01-01",
    },
    {
      id: 2,
      client: "Sarah Silva",
      event: "Corporate Event",
      date: "2024-01-22",
      time: "6:30 PM",
      location: "Kandy",
      budget: "LKR 30,000",
      status: "pending",
      requestDate: "2024-01-03",
    },
  ]

  const upcomingBookings = [
    {
      id: 3,
      client: "Mike Fernando",
      event: "Birthday Party",
      date: "2024-01-18",
      time: "8:00 PM",
      location: "Galle",
      amount: "LKR 20,000",
      status: "confirmed",
    },
  ]

  const stats = [
    { label: "Total Earnings", value: "LKR 450,000", icon: DollarSign, color: "text-green-400" },
    { label: "This Month", value: "LKR 75,000", icon: TrendingUp, color: "text-blue-400" },
    { label: "Pending Requests", value: "5", icon: Clock, color: "text-yellow-400" },
    { label: "Average Rating", value: "4.8", icon: Star, color: "text-yellow-400" },
  ]

  const recentActivity = [
    { type: "booking", message: "New booking request from John Doe", time: "2 hours ago" },
    { type: "payment", message: "Payment received for Birthday Party event", time: "1 day ago" },
    { type: "review", message: "New 5-star review from Sarah Silva", time: "2 days ago" },
  ]

  return (
    <AuthGuard requiredRole="performer">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                Welcome back, <span className="gradient-text">Kasun!</span>
              </h1>
              <p className="text-gray-600">Manage your bookings and grow your performance career</p>
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
              {/* Pending Requests */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Pending Requests</h2>
                    <Link href="/performer/bookings">
                      <Button variant="ghost" className="text-primary hover:bg-gray-100">
                        View All
                      </Button>
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {pendingRequests.map((request) => (
                      <Card key={request.id} className="glass-card p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{request.client}</h3>
                              <Badge className="bg-yellow-500/20 text-yellow-700">Pending</Badge>
                            </div>
                            <p className="text-gray-600 mb-2">{request.event}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {request.date}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {request.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {request.location}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold gradient-text">{request.budget}</p>
                            <p className="text-sm text-gray-500">Requested {request.requestDate}</p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" className="glow-button flex-1">
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 glass-card border-red-500/20 text-red-600 hover:bg-red-500/10 bg-transparent"
                          >
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="glass-card border-gray-200 text-gray-700 hover:bg-gray-100 bg-transparent"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Upcoming Bookings */}
                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Upcoming Bookings</h2>
                    <Link href="/performer/bookings">
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
                              <h3 className="font-semibold text-gray-900">{booking.client}</h3>
                              <Badge className="bg-green-500/20 text-green-700">Confirmed</Badge>
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

              {/* Sidebar */}
              <div>
                {/* Profile Preview */}
                <Card className="glass-card p-6 mb-6">
                  <div className="text-center mb-4">
                    <img
                      src="/sri-lankan-male-singer.png"
                      alt="Profile"
                      className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="font-semibold text-gray-900">Kasun Perera</h3>
                    <p className="text-gray-500 text-sm">Singer • Colombo</p>
                    <div className="flex items-center justify-center space-x-1 mt-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900">4.8</span>
                      <span className="text-gray-500 text-sm">(127 reviews)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link href="/performer/profile">
                      <Button className="w-full glow-button">
                        <Eye className="w-4 h-4 mr-2" />
                        View Public Profile
                      </Button>
                    </Link>
                    <Link href="/performer/profile/edit">
                      <Button
                        variant="outline"
                        className="w-full glass-card border-gray-200 text-gray-700 hover:bg-gray-100 bg-transparent"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Activity</h2>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
