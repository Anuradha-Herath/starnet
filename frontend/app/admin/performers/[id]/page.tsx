"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit,
  MessageSquare,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"

export default function PerformerDetailPage() {
  return (
    <RedirectGuard allowedRoles={["admin"]}>
      <PerformerDetailContent />
    </RedirectGuard>
  )
}

function PerformerDetailContent() {
  const params = useParams()
  const performerId = parseInt(params.id as string)
  const [performer, setPerformer] = useState<any>(null)

  // Mock data - in real app, this would be fetched from API
  const performers = [
    {
      id: 1,
      name: "Kasun Perera",
      email: "kasun.perera@example.com",
      phone: "+94 77 123 4567",
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
      bio: "Professional singer with 8+ years of experience in traditional Sri Lankan music. Specializes in wedding ceremonies and cultural events.",
      skills: ["Traditional Singing", "Wedding Songs", "Cultural Events", "Live Performances"],
      languages: ["Sinhala", "English"],
      experience: "8 years",
      completedEvents: 156,
      responseTime: "< 2 hours",
      verificationDate: "2023-07-01",
    },
    {
      id: 2,
      name: "Nimali Fernando",
      email: "nimali.fernando@example.com",
      phone: "+94 77 234 5678",
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
      bio: "Classical dancer trained in Kandyan dance traditions. Performs at festivals and cultural events across Sri Lanka.",
      skills: ["Kandyan Dance", "Traditional Dance", "Cultural Performances", "Group Choreography"],
      languages: ["Sinhala", "English"],
      experience: "6 years",
      completedEvents: 98,
      responseTime: "< 4 hours",
      verificationDate: "2023-09-05",
    },
    {
      id: 3,
      name: "The Rhythm Band",
      email: "rhythmband@example.com",
      phone: "+94 77 345 6789",
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
      bio: "Professional music band specializing in modern and traditional Sri Lankan music. Available for weddings, corporate events, and festivals.",
      skills: ["Modern Music", "Traditional Music", "Live Band", "Event Entertainment"],
      languages: ["Sinhala", "English", "Tamil"],
      experience: "10 years",
      completedEvents: 203,
      responseTime: "< 6 hours",
      verificationDate: "2023-05-25",
    },
    {
      id: 4,
      name: "DJ Saman",
      email: "dj.saman@example.com",
      phone: "+94 77 456 7890",
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
      bio: "Professional DJ with expertise in mixing modern tracks with traditional beats. Specializes in wedding receptions and parties.",
      skills: ["DJ Mixing", "Sound Engineering", "Event Hosting", "Modern Music"],
      languages: ["Sinhala", "English"],
      experience: "5 years",
      completedEvents: 134,
      responseTime: "< 1 hour",
      verificationDate: null,
    },
    {
      id: 5,
      name: "Ravi Guitar",
      email: "ravi.guitar@example.com",
      phone: "+94 77 567 8901",
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
      bio: "Acoustic guitarist specializing in romantic music for weddings and private events.",
      skills: ["Acoustic Guitar", "Romantic Music", "Wedding Music", "Solo Performances"],
      languages: ["Sinhala", "English"],
      experience: "7 years",
      completedEvents: 89,
      responseTime: "< 3 hours",
      verificationDate: "2023-10-20",
    },
  ]

  useEffect(() => {
    const foundPerformer = performers.find(p => p.id === performerId)
    setPerformer(foundPerformer)
  }, [performerId])

  if (!performer) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="min-h-screen">
          <Navigation />
          <div className="pt-24 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 text-gray/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray/70 mb-2">Performer not found</h3>
                <Link href="/admin/performers">
                  <Button className="glow-button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Performers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </AuthGuard>
    )
  }

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

  const StatusIcon = getStatusIcon(performer.status)

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link href="/admin/performers">
                <Button variant="ghost" className="mb-4 text-gray/70 hover:text-gray hover:bg-white/10">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Performers
                </Button>
              </Link>
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Performer <span className="gradient-text">Details</span>
              </h1>
              <p className="text-gray/70">Detailed information about {performer.name}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Card */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="glass-card p-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={performer.image || "/placeholder.svg"}
                      alt={performer.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-shadow">{performer.name}</h2>
                        <Badge className={getStatusColor(performer.status)}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {performer.status}
                        </Badge>
                      </div>
                      <p className="text-gray/70 mb-4">{performer.bio}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray/60" />
                          <span className="text-sm">{performer.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray/60" />
                          <span className="text-sm">{performer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray/60" />
                          <span className="text-sm">{performer.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray/60" />
                          <span className="text-sm">Joined {performer.joinDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{performer.rating}</span>
                          <span className="text-gray/60">({performer.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">Last active {performer.lastActive}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Skills and Languages */}
                <Card className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-4 text-shadow">Skills & Languages</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {performer.skills.map((skill: string, index: number) => (
                          <Badge key={index} variant="secondary" className="bg-primary/20 text-primary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {performer.languages.map((language: string, index: number) => (
                          <Badge key={index} variant="outline" className="border-white/20">
                            {language}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Stats Card */}
                <Card className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-4 text-shadow">Statistics</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Total Bookings</span>
                      <span className="font-semibold">{performer.bookings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Completed Events</span>
                      <span className="font-semibold">{performer.completedEvents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Total Earnings</span>
                      <span className="font-semibold text-green-400">{performer.earnings}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Experience</span>
                      <span className="font-semibold">{performer.experience}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray/70">Response Time</span>
                      <span className="font-semibold">{performer.responseTime}</span>
                    </div>
                  </div>
                </Card>

                {/* Actions Card */}
                <Card className="glass-card p-6">
                  <h3 className="text-xl font-semibold mb-4 text-shadow">Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full glow-button">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    {performer.status === "pending" && (
                      <>
                        <Button className="w-full glow-button">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify Performer
                        </Button>
                        <Button variant="outline" className="w-full glass-card border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Application
                        </Button>
                      </>
                    )}
                    {performer.status === "verified" && (
                      <Button variant="outline" className="w-full glass-card border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10 bg-transparent">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Suspend Account
                      </Button>
                    )}
                    {performer.status === "suspended" && (
                      <Button className="w-full glow-button">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Reactivate Account
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Verification Info */}
                {performer.verificationDate && (
                  <Card className="glass-card p-6">
                    <div className="flex items-center space-x-3">
                      <Award className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="font-medium">Verified</h4>
                        <p className="text-sm text-gray/60">Verified on {performer.verificationDate}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}