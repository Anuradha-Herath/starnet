"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import {
  Users,
  Music,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Bell,
  Settings,
  BarChart3,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <RedirectGuard allowedRoles={["admin"]}>
      <AdminDashboardContent />
    </RedirectGuard>
  )
}

function AdminDashboardContent() {
  const stats = [
    { label: "Total Users", value: "2,847", change: "+12%", icon: Users, color: "text-blue-400" },
    { label: "Active Performers", value: "1,234", change: "+8%", icon: Music, color: "text-green-400" },
    { label: "Total Bookings", value: "5,678", change: "+15%", icon: Calendar, color: "text-purple-400" },
    { label: "Platform Revenue", value: "LKR 2.3M", change: "+22%", icon: DollarSign, color: "text-yellow-400" },
  ]

  const recentActivity = [
    {
      type: "user_signup",
      message: "New performer registered: Chamari Voice",
      time: "2 hours ago",
      icon: Music,
      color: "text-green-400",
    },
    {
      type: "booking",
      message: "High-value booking completed: LKR 75,000",
      time: "4 hours ago",
      icon: Calendar,
      color: "text-blue-400",
    },
    {
      type: "report",
      message: "User reported inappropriate content",
      time: "6 hours ago",
      icon: AlertTriangle,
      color: "text-red-400",
    },
    {
      type: "payment",
      message: "Payment dispute resolved",
      time: "1 day ago",
      icon: DollarSign,
      color: "text-yellow-400",
    },
  ]

  const pendingActions = [
    {
      id: 1,
      type: "performer_verification",
      title: "Performer Verification",
      description: "5 performers awaiting verification",
      priority: "high",
      count: 5,
    },
    {
      id: 2,
      type: "content_moderation",
      title: "Content Moderation",
      description: "3 reports need review",
      priority: "medium",
      count: 3,
    },
    {
      id: 3,
      type: "payment_disputes",
      title: "Payment Disputes",
      description: "2 disputes require attention",
      priority: "high",
      count: 2,
    },
    {
      id: 4,
      type: "category_requests",
      title: "Category Requests",
      description: "4 new category requests",
      priority: "low",
      count: 4,
    },
  ]

  const topPerformers = [
    {
      name: "Kasun Perera",
      category: "Singer",
      bookings: 45,
      rating: 4.9,
      earnings: "LKR 450,000",
      image: "/sri-lankan-male-singer.png",
    },
    {
      name: "Nimali Fernando",
      category: "Dancer",
      bookings: 38,
      rating: 4.8,
      earnings: "LKR 380,000",
      image: "/sri-lankan-dancer.png",
    },
    {
      name: "The Rhythm Band",
      category: "Band",
      bookings: 32,
      rating: 4.7,
      earnings: "LKR 960,000",
      image: "/sri-lankan-music-band.png",
    },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400"
      case "low":
        return "bg-green-500/20 text-green-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Admin <span className="gradient-text">Dashboard</span>
              </h1>
              <p className="text-gray/70">Platform overview and management tools</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-gray/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-shadow">{stat.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Pending Actions */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-shadow">Pending Actions</h2>
                    <Badge className="bg-red-500/20 text-red-400">
                      {pendingActions.reduce((sum, action) => sum + action.count, 0)} items
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    {pendingActions.map((action) => (
                      <Card key={action.id} className="glass-card p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-shadow">{action.title}</h3>
                              <Badge className={getPriorityColor(action.priority)}>{action.priority}</Badge>
                            </div>
                            <p className="text-gray/70 text-sm">{action.description}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-center">
                              <p className="text-2xl font-bold gradient-text">{action.count}</p>
                              <p className="text-xs text-gray/60">pending</p>
                            </div>
                            <Button size="sm" className="glow-button">
                              Review
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-card p-6">
                  <h2 className="text-2xl font-semibold mb-6 text-shadow">Recent Activity</h2>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray/90 text-sm">{activity.message}</p>
                          <p className="text-gray/50 text-xs">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                {/* Top Performers */}
                <Card className="glass-card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-shadow">Top Performers</h2>
                  <div className="space-y-4">
                    {topPerformers.map((performer, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <img
                          src={performer.image || "/placeholder.svg"}
                          alt={performer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-shadow">{performer.name}</p>
                          <p className="text-sm text-gray/60">{performer.category}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray/60">
                            <span>{performer.bookings} bookings</span>
                            <span>•</span>
                            <span>★ {performer.rating}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold gradient-text">{performer.earnings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* System Status */}
                <Card className="glass-card p-6">
                  <h2 className="text-xl font-semibold mb-4 text-shadow">System Status</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray/80">Platform Status</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray/80">Payment Gateway</span>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray/80">Backup Status</span>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Running</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span className="text-sm text-gray/80">Maintenance</span>
                      </div>
                      <Badge className="bg-red-500/20 text-red-400">Scheduled</Badge>
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
