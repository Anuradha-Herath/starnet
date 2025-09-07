"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import { Music, Bell, User, Camera, Save, Star, Upload, X, Plus, Edit } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function PerformerProfilePage() {
  return (
    <RedirectGuard allowedRoles={["performer"]}>
      <PerformerProfileContent />
    </RedirectGuard>
  )
}

function PerformerProfileContent() {
  const [activeTab, setActiveTab] = useState("basic")
  const [profileData, setProfileData] = useState({
    stageName: "Kasun Perera",
    firstName: "Kasun",
    lastName: "Perera",
    email: "kasun.perera@example.com",
    phone: "+94 77 123 4567",
    location: "Colombo",
    category: "Singer",
    bio: "Professional singer with 10+ years of experience in weddings, corporate events, and private parties. Specializing in Sinhala classics, English pop, and contemporary hits.",
    experience: "10+ years",
    basePrice: "25000",
    availability: "Available",
  })

  const [skills, setSkills] = useState(["Vocals", "Guitar", "Piano", "Stage Performance"])
  const [newSkill, setNewSkill] = useState("")

  const [portfolio, setPortfolio] = useState([
    { id: 1, type: "image", url: "/sri-lankan-male-singer.png", title: "Wedding Performance" },
    { id: 2, type: "video", url: "#", title: "Corporate Event Highlights" },
    { id: 3, type: "audio", url: "#", title: "Sample Performance" },
  ])

  const tabs = [
    { id: "basic", name: "Basic Information" },
    { id: "professional", name: "Professional Details" },
    { id: "portfolio", name: "Portfolio" },
    { id: "pricing", name: "Pricing & Availability" },
  ]

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()])
      setNewSkill("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  return (
    <AuthGuard requiredRole="performer">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                My <span className="gradient-text">Profile</span>
              </h1>
              <p className="text-gray/70">Manage your performer profile and showcase your talent</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="glass-card p-6 mb-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <img
                        src="/sri-lankan-male-singer.png"
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover mb-4"
                      />
                      <Button size="sm" className="absolute-right-2 w-8 h-8 rounded-full glow-button p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-shadow mb-1">{profileData.stageName}</h3>
                    <p className="text-gray/60 text-sm mb-2">
                      {profileData.category} • {profileData.location}
                    </p>
                    <div className="flex items-center justify-center space-x-1 mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">4.8</span>
                      <span className="text-gray/60 text-sm">(127)</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400">{profileData.availability}</Badge>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full justify-start text-sm ${
                          activeTab === tab.id ? "glow-button" : "text-gray/70 hover:text-gray hover:bg-white/10"
                        }`}
                      >
                        {tab.name}
                      </Button>
                    ))}
                  </nav>
                </Card>

              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {activeTab === "basic" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Basic Information</h2>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="stageName" className="text-gray font-medium">
                          Stage/Professional Name
                        </Label>
                        <Input
                          id="stageName"
                          value={profileData.stageName}
                          onChange={(e) => setProfileData({ ...profileData, stageName: e.target.value })}
                          className="glass-card bg-white/5 border-white/20 text-gray"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-gray font-medium">
                            First Name
                          </Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-gray font-medium">
                            Last Name
                          </Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray font-medium">
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-gray font-medium">
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="location" className="text-gray font-medium">
                            Location
                          </Label>
                          <Input
                            id="location"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="category" className="text-gray font-medium">
                            Category
                          </Label>
                          <Input
                            id="category"
                            value={profileData.category}
                            onChange={(e) => setProfileData({ ...profileData, category: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray font-medium">
                          Bio/Description
                        </Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="glass-card bg-white/5 border-white/20 text-gray min-h-[120px]"
                          placeholder="Tell clients about your experience, style, and what makes you unique..."
                        />
                      </div>

                      <Button className="glow-button">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Card>
                )}

                {activeTab === "professional" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Professional Details</h2>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="experience" className="text-gray font-medium">
                          Years of Experience
                        </Label>
                        <Input
                          id="experience"
                          value={profileData.experience}
                          onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                          className="glass-card bg-white/5 border-white/20 text-gray"
                          placeholder="e.g., 5+ years"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray font-medium">Skills & Specialties</Label>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {skills.map((skill, index) => (
                            <Badge
                              key={index}
                              className="bg-white/10 text-gray/80 hover:bg-white/20 cursor-pointer group"
                              onClick={() => removeSkill(skill)}
                            >
                              {skill}
                              <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            placeholder="Add a skill..."
                            className="glass-card bg-white/5 border-white/20 text-gray"
                            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                          />
                          <Button type="button" onClick={addSkill} className="glow-button">
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray font-medium">Event Types</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Weddings",
                            "Corporate Events",
                            "Private Parties",
                            "Concerts",
                            "Festivals",
                            "Restaurants",
                          ].map((eventType) => (
                            <label key={eventType} className="flex items-center space-x-2">
                              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                              <span className="text-gray/80 text-sm">{eventType}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray font-medium">Equipment Provided</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            "Sound System",
                            "Microphones",
                            "Instruments",
                            "Lighting",
                            "DJ Equipment",
                            "Backup Vocals",
                          ].map((equipment) => (
                            <label key={equipment} className="flex items-center space-x-2">
                              <input type="checkbox" className="rounded border-white/20 bg-white/5" />
                              <span className="text-gray/80 text-sm">{equipment}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Button className="glow-button">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Card>
                )}

                {activeTab === "portfolio" && (
                  <Card className="glass-card p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-semibold text-shadow">Portfolio</h2>
                      <Button className="glow-button">
                        <Upload className="w-4 h-4 mr-2" />
                        Add Media
                      </Button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolio.map((item) => (
                        <Card key={item.id} className="glass-card overflow-hidden group">
                          <div className="relative">
                            {item.type === "image" && (
                              <img
                                src={item.url || "/placeholder.svg"}
                                alt={item.title}
                                className="w-full h-48 object-cover"
                              />
                            )}
                            {item.type === "video" && (
                              <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1"></div>
                                  </div>
                                  <p className="text-gray/70 text-sm">Video</p>
                                </div>
                              </div>
                            )}
                            {item.type === "audio" && (
                              <div className="w-full h-48 bg-white/10 flex items-center justify-center">
                                <div className="text-center">
                                  <Music className="w-12 h-12 text-gray/70 mx-auto mb-2" />
                                  <p className="text-gray/70 text-sm">Audio</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                              <Button size="sm" className="glow-button">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass-card border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-shadow">{item.title}</h3>
                          </div>
                        </Card>
                      ))}

                      {/* Add New Item */}
                      <Card className="glass-card border-dashed border-white/30 hover:border-white/50 transition-colors cursor-pointer">
                        <div className="h-48 flex items-center justify-center">
                          <div className="text-center">
                            <Plus className="w-12 h-12 text-gray/50 mx-auto mb-2" />
                            <p className="text-gray/70">Add Media</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-gray/60 text-sm">Upload photos, videos, or audio samples</p>
                        </div>
                      </Card>
                    </div>
                  </Card>
                )}

                {activeTab === "pricing" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Pricing & Availability</h2>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="basePrice" className="text-gray font-medium">
                          Base Price (LKR)
                        </Label>
                        <Input
                          id="basePrice"
                          value={profileData.basePrice}
                          onChange={(e) => setProfileData({ ...profileData, basePrice: e.target.value })}
                          className="glass-card bg-white/5 border-white/20 text-gray"
                          placeholder="25000"
                        />
                        <p className="text-gray/60 text-sm">Starting price for a standard 2-hour performance</p>
                      </div>

                      <div className="space-y-4">
                        <Label className="text-gray font-medium">Package Options</Label>
                        <div className="space-y-4">
                          {[
                            {
                              name: "Basic Package",
                              duration: "2 hours",
                              price: "25000",
                              features: ["Solo performance", "Basic sound system"],
                            },
                            {
                              name: "Standard Package",
                              duration: "3 hours",
                              price: "35000",
                              features: ["Solo performance", "Professional sound", "Costume changes"],
                            },
                            {
                              name: "Premium Package",
                              duration: "4 hours",
                              price: "50000",
                              features: [
                                "Full band",
                                "Premium sound & lighting",
                                "Multiple costume changes",
                                "Special requests",
                              ],
                            },
                          ].map((pkg, index) => (
                            <Card key={index} className="glass-card p-4 border border-white/10">
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h3 className="font-semibold text-shadow">{pkg.name}</h3>
                                  <p className="text-gray/60 text-sm">{pkg.duration}</p>
                                </div>
                                <p className="font-semibold gradient-text">LKR {pkg.price}</p>
                              </div>
                              <ul className="space-y-1">
                                {pkg.features.map((feature, i) => (
                                  <li key={i} className="text-gray/70 text-sm flex items-center">
                                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2"></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </Card>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-gray font-medium">Availability Status</Label>
                        <div className="space-y-2">
                          {[
                            { id: "available", label: "Available for bookings" },
                            { id: "busy", label: "Busy (limited availability)" },
                            { id: "unavailable", label: "Currently unavailable" },
                          ].map((status) => (
                            <label key={status.id} className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="availability"
                                value={status.id}
                                defaultChecked={status.id === "available"}
                                className="border-white/20 bg-white/5"
                              />
                              <span className="text-gray/80">{status.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Button className="glow-button">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
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
