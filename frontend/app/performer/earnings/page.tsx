"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { Navigation } from "@/components/navigation"
import {
  Music,
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  Bell,
  User,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PerformerEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const stats = [
    { label: "Total Earnings", value: "LKR 450,000", change: "+12%", icon: DollarSign, color: "text-green-400" },
    { label: "This Month", value: "LKR 75,000", change: "+8%", icon: TrendingUp, color: "text-blue-400" },
    {
      label: "Pending Payments",
      value: "LKR 25,000",
      change: "2 bookings",
      icon: CreditCard,
      color: "text-yellow-400",
    },
    { label: "Average per Event", value: "LKR 22,500", change: "+5%", icon: ArrowUpRight, color: "text-green-400" },
  ]

  const recentPayments = [
    {
      id: 1,
      client: "John Doe",
      event: "Wedding Reception",
      date: "2024-01-15",
      amount: "LKR 25,000",
      status: "paid",
      paymentDate: "2024-01-16",
      method: "Bank Transfer",
    },
    {
      id: 2,
      client: "Sarah Silva",
      event: "Corporate Event",
      date: "2024-01-10",
      amount: "LKR 30,000",
      status: "pending",
      paymentDate: "Due Jan 25",
      method: "Bank Transfer",
    },
    {
      id: 3,
      client: "Mike Fernando",
      event: "Birthday Party",
      date: "2024-01-05",
      amount: "LKR 20,000",
      status: "paid",
      paymentDate: "2024-01-06",
      method: "Cash",
    },
  ]

  const monthlyData = [
    { month: "Jan 2024", earnings: 75000, bookings: 3 },
    { month: "Dec 2023", earnings: 85000, bookings: 4 },
    { month: "Nov 2023", earnings: 65000, bookings: 3 },
    { month: "Oct 2023", earnings: 90000, bookings: 4 },
    { month: "Sep 2023", earnings: 70000, bookings: 3 },
    { month: "Aug 2023", earnings: 60000, bookings: 2 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "overdue":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
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
                <span className="gradient-text">Earnings</span> Overview
              </h1>
              <p className="text-gray/70">Track your income and payment history</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    <div className="flex items-center space-x-1 text-sm">
                      {stat.change.startsWith("+") ? (
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                      ) : stat.change.startsWith("-") ? (
                        <ArrowDownRight className="w-4 h-4 text-red-400" />
                      ) : null}
                      <span className={stat.change.startsWith("+") ? "text-green-400" : "text-gray/60"}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray/60 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-shadow">{stat.value}</p>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Monthly Earnings Chart */}
              <div className="lg:col-span-2">
                <Card className="glass-card p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-shadow">Earnings Trend</h2>
                    <div className="flex space-x-2">
                      {["week", "month", "year"].map((period) => (
                        <Button
                          key={period}
                          variant={selectedPeriod === period ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setSelectedPeriod(period)}
                          className={
                            selectedPeriod === period ? "glow-button" : "text-gray/70 hover:text-gray text-sm"
                          }
                        >
                          {period.charAt(0).toUpperCase() + period.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {monthlyData.map((data, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 glass-card border border-white/10"
                      >
                        <div>
                          <p className="font-medium text-shadow">{data.month}</p>
                          <p className="text-gray/60 text-sm">{data.bookings} bookings</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold gradient-text">LKR {data.earnings.toLocaleString()}</p>
                          <div className="w-32 bg-white/10 rounded-full h-2 mt-2">
                            <div
                              className="bg-gradient-to-r from-primary to-primary-light h-2 rounded-full"
                              style={{ width: `${(data.earnings / 100000) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Payments */}
                <Card className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-shadow">Recent Payments</h2>
                    <Button
                      variant="outline"
                      className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentPayments.map((payment) => (
                      <Card key={payment.id} className="glass-card p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-shadow">{payment.client}</h3>
                              <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                            </div>
                            <p className="text-gray/70 mb-1">{payment.event}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray/60">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {payment.date}
                              </div>
                              <span>•</span>
                              <span>{payment.method}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold gradient-text">{payment.amount}</p>
                            <p className="text-sm text-gray/60">{payment.paymentDate}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div>
                {/* Payment Methods */}
                <Card className="glass-card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-shadow">Payment Methods</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 glass-card border border-white/10">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-6 h-6 text-gray/70" />
                        <div>
                          <p className="font-medium text-shadow">Bank Transfer</p>
                          <p className="text-sm text-gray/60">Primary</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card border border-white/10">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-6 h-6 text-gray/70" />
                        <div>
                          <p className="font-medium text-shadow">Cash</p>
                          <p className="text-sm text-gray/60">On-site</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-500/20 text-blue-400">Available</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                  >
                    Manage Payment Methods
                  </Button>
                </Card>

              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
