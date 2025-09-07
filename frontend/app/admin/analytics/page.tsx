"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import {
  Shield,
  Bell,
  Settings,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  BarChart3,
  PieChart,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const overviewStats = [
    {
      label: "Total Revenue",
      value: "LKR 2.3M",
      change: "+22%",
      trend: "up",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      label: "New Users",
      value: "847",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-400",
    },
    {
      label: "Bookings",
      value: "1,234",
      change: "+8%",
      trend: "up",
      icon: Calendar,
      color: "text-purple-400",
    },
    {
      label: "Conversion Rate",
      value: "3.2%",
      change: "-0.5%",
      trend: "down",
      icon: TrendingUp,
      color: "text-yellow-400",
    },
  ]

  const monthlyData = [
    { month: "Jan 2024", revenue: 230000, bookings: 156, users: 89 },
    { month: "Dec 2023", revenue: 210000, bookings: 142, users: 76 },
    { month: "Nov 2023", revenue: 195000, bookings: 128, users: 68 },
    { month: "Oct 2023", revenue: 180000, bookings: 115, users: 72 },
    { month: "Sep 2023", revenue: 165000, bookings: 98, users: 54 },
    { month: "Aug 2023", revenue: 150000, bookings: 87, users: 61 },
  ]

  const categoryData = [
    { category: "Singers", bookings: 456, revenue: 912000, percentage: 35 },
    { category: "Bands", bookings: 234, revenue: 702000, percentage: 27 },
    { category: "DJs", bookings: 189, revenue: 378000, percentage: 18 },
    { category: "Dancers", bookings: 156, revenue: 312000, percentage: 12 },
    { category: "Musicians", bookings: 98, revenue: 196000, percentage: 8 },
  ]

  const topLocations = [
    { location: "Colombo", bookings: 567, percentage: 42 },
    { location: "Kandy", bookings: 234, percentage: 18 },
    { location: "Galle", bookings: 189, percentage: 14 },
    { location: "Negombo", bookings: 156, percentage: 12 },
    { location: "Matara", bookings: 123, percentage: 9 },
    { location: "Others", bookings: 67, percentage: 5 },
  ]

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2 text-shadow">
                    Reports & <span className="gradient-text">Analytics</span>
                  </h1>
                  <p className="text-gray/70">Platform performance insights and data analysis</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    {["week", "month", "year"].map((period) => (
                      <Button
                        key={period}
                        variant={selectedPeriod === period ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedPeriod(period)}
                        className={selectedPeriod === period ? "glow-button" : "text-gray/70 hover:text-gray text-sm"}
                      >
                        {period.charAt(0).toUpperCase() + period.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <Button className="glow-button">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {overviewStats.map((stat, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className="flex items-center space-x-1 text-sm">
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      )}
                      <span className={stat.trend === "up" ? "text-green-400" : "text-red-400"}>{stat.change}</span>
                    </div>
                  </div>
                  <p className="text-gray/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-shadow">{stat.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Revenue Trend */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-shadow">Revenue Trend</h2>
                    <BarChart3 className="w-6 h-6 text-gray/70" />
                  </div>

                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 glass-card border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-shadow">{data.month}</p>
                          <p className="text-gray/60 text-sm">
                            {data.bookings} bookings • {data.users} new users
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold gradient-text">LKR {data.revenue.toLocaleString()}</p>
                          <div className="w-32 bg-white/10 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                              style={{ width: `${(data.revenue / 250000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Category Performance */}
                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-shadow">Category Performance</h2>
                    <PieChart className="w-6 h-6 text-gray/70" />
                  </div>

                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-shadow">{category.category}</p>
                            <p className="text-sm text-gray/60">{category.percentage}%</p>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <div className="flex items-center justify-between mt-2 text-sm text-gray/60">
                            <span>{category.bookings} bookings</span>
                            <span>LKR {category.revenue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                {/* Top Locations */}
                <Card className="glass-card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-shadow">Top Locations</h2>
                  <div className="space-y-3">
                    {topLocations.map((location, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-shadow">{location.location}</p>
                            <p className="text-sm text-gray/60">{location.percentage}%</p>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1.5">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-1.5 rounded-full"
                              style={{ width: `${location.percentage}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray/60 mt-1">{location.bookings} bookings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Key Metrics */}
                <Card className="glass-card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-shadow">Key Metrics</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Average Booking Value</span>
                      <span className="font-semibold gradient-text">LKR 28,500</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Customer Retention</span>
                      <span className="font-semibold text-green-400">68%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Platform Commission</span>
                      <span className="font-semibold text-yellow-400">10%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Active Performers</span>
                      <span className="font-semibold text-blue-400">1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Dispute Rate</span>
                      <span className="font-semibold text-red-400">2.1%</span>
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
