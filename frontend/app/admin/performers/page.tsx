"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import {
  Shield,
  Search,
  Filter,
  Bell,
  Settings,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AdminPerformersPage() {
  return (
    <RedirectGuard allowedRoles={["admin"]}>
      <AdminPerformersContent />
    </RedirectGuard>
  )
}

function AdminPerformersContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const performers = [
    {
      id: 1,
      name: "Kasun Perera",
      email: "kasun.perera@example.com",
      category: "Singer",
      location: "Colombo",
      joinDate: "2023-06-15",
      status: "verified",
      rating: 4.9,
      reviews: 127,
      bookings: 45,
      earnings: "LKR 450,000",
      image: "/sri-lankan-male-singer.png",
      lastActive: "2 hours ago",
    },
    {
      id: 2,
      name: "Nimali Fernando",
      email: "nimali.fernando@example.com",
      category: "Classical Dancer",
      location: "Kandy",
      joinDate: "2023-08-22",
      status: "verified",
      rating: 4.8,
      reviews: 89,
      bookings: 38,
      earnings: "LKR 380,000",
      image: "/sri-lankan-dancer.png",
      lastActive: "1 day ago",
    },
    {
      id: 3,
      name: "The Rhythm Band",
      email: "rhythmband@example.com",
      category: "Band",
      location: "Galle",
      joinDate: "2023-05-10",
      status: "verified",
      rating: 4.7,
      reviews: 156,
      bookings: 32,
      earnings: "LKR 960,000",
      image: "/sri-lankan-music-band.png",
      lastActive: "3 hours ago",
    },
    {
      id: 4,
      name: "DJ Saman",
      email: "dj.saman@example.com",
      category: "DJ",
      location: "Colombo",
      joinDate: "2023-09-05",
      status: "pending",
      rating: 4.9,
      reviews: 203,
      bookings: 67,
      earnings: "LKR 670,000",
      image: "/sri-lankan-dj.png",
      lastActive: "5 hours ago",
    },
    {
      id: 5,
      name: "Ravi Guitar",
      email: "ravi.guitar@example.com",
      category: "Musician",
      location: "Negombo",
      joinDate: "2023-10-12",
      status: "suspended",
      rating: 4.6,
      reviews: 74,
      bookings: 28,
      earnings: "LKR 280,000",
      image: "/sri-lankan-guitarist.png",
      lastActive: "2 weeks ago",
    },
  ]

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "verified", label: "Verified" },
    { value: "pending", label: "Pending" },
    { value: "suspended", label: "Suspended" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-500/20 text-green-400"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400"
      case "suspended":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return CheckCircle
      case "pending":
        return AlertTriangle
      case "suspended":
        return XCircle
      default:
        return AlertTriangle
    }
  }

  const filteredPerformers = statusFilter === "all" ? performers : performers.filter((p) => p.status === statusFilter)

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Manage <span className="gradient-text">Performers</span>
              </h1>
              <p className="text-gray/70">Review and manage performer accounts on the platform</p>
            </div>

            {/* Search and Filters */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray/50" />
                  <Input
                    placeholder="Search performers by name, email, or category..."
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

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Total Performers</p>
                    <p className="text-2xl font-bold text-shadow">{performers.length}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Verified</p>
                    <p className="text-2xl font-bold text-shadow">
                      {performers.filter((p) => p.status === "verified").length}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-shadow">
                      {performers.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-400" />
                </div>
              </Card>
              <Card className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray/60 text-sm">Suspended</p>
                    <p className="text-2xl font-bold text-shadow">
                      {performers.filter((p) => p.status === "suspended").length}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              </Card>
            </div>

            {/* Performers List */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-shadow">Performers ({filteredPerformers.length})</h2>
                <Button className="glow-button">Export Data</Button>
              </div>

              <div className="space-y-4">
                {filteredPerformers.map((performer) => {
                  const StatusIcon = getStatusIcon(performer.status)
                  return (
                    <Card key={performer.id} className="glass-card p-6 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <img
                            src={performer.image || "/placeholder.svg"}
                            alt={performer.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-xl font-semibold text-shadow">{performer.name}</h3>
                              <Badge className={getStatusColor(performer.status)}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {performer.status}
                              </Badge>
                            </div>
                            <p className="text-gray/70 mb-2">{performer.email}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray/60 mb-3">
                              <span>{performer.category}</span>
                              <span>•</span>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {performer.location}
                              </div>
                              <span>•</span>
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                Joined {performer.joinDate}
                              </div>
                            </div>
                            <div className="flex items-center space-x-6 text-sm">
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="font-medium">{performer.rating}</span>
                                <span className="text-gray/60">({performer.reviews})</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4 text-blue-400" />
                                <span>{performer.bookings} bookings</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <span>{performer.earnings}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="text-right mr-4">
                            <p className="text-sm text-gray/60">Last active</p>
                            <p className="text-sm font-medium">{performer.lastActive}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                            asChild
                          >
                            <Link href={`/admin/performers/${performer.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </Link>
                          </Button>
                          {performer.status === "pending" && (
                            <>
                              <Button size="sm" className="glow-button">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass-card border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </>
                          )}
                          {performer.status === "verified" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass-card border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 bg-transparent"
                            >
                              <AlertTriangle className="w-4 h-4 mr-2" />
                              Suspend
                            </Button>
                          )}
                          {performer.status === "suspended" && (
                            <Button size="sm" className="glow-button">
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Reactivate
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray/70 hover:text-gray hover:bg-white/10"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>

              {filteredPerformers.length === 0 && (
                <div className="text-center py-12">
                  <AlertTriangle className="w-16 h-16 text-gray/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray/70 mb-2">No performers found</h3>
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
