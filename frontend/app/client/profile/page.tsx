"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import { Music, Bell, User, Camera, Save, Eye, EyeOff, CreditCard, Shield, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function ClientProfilePage() {
  return (
    <RedirectGuard allowedRoles={["client"]}>
      <ClientProfileContent />
    </RedirectGuard>
  )
}

function ClientProfileContent() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+94 77 123 4567",
    location: "Colombo",
    bio: "Event organizer passionate about bringing great entertainment to special occasions.",
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const tabs = [
    { id: "profile", name: "Profile Information" },
    { id: "security", name: "Security" },
    { id: "preferences", name: "Preferences" },
    { id: "billing", name: "Billing" },
  ]

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Profile <span className="gradient-text">Settings</span>
              </h1>
              <p className="text-gray/70">Manage your account settings and preferences</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <Card className="glass-card p-6">
                  <div className="text-center mb-6">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center text-2xl font-bold text-gray mb-4">
                        JD
                      </div>
                      <Button size="sm" className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full glow-button p-0">
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <h3 className="font-semibold text-shadow">
                      {profileData.firstName} {profileData.lastName}
                    </h3>
                    <p className="text-gray/60 text-sm">Client Account</p>
                  </div>

                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <Button
                        key={tab.id}
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full justify-start ${
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
                {activeTab === "profile" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Profile Information</h2>

                    <form className="space-y-6">
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

                      <div className="grid md:grid-cols-2 gap-6">
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
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-gray font-medium">
                          Bio
                        </Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          className="glass-card bg-white/5 border-white/20 text-gray min-h-[100px]"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <Button className="glow-button">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Card>
                )}

                {activeTab === "security" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Security Settings</h2>

                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword" className="text-gray font-medium">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray/50 hover:text-gray"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-gray font-medium">
                          New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray/50 hover:text-gray"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray font-medium">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="glass-card bg-white/5 border-white/20 text-gray pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray/50 hover:text-gray"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <Button className="glow-button">
                        <Shield className="w-4 h-4 mr-2" />
                        Update Password
                      </Button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/10">
                      <h3 className="text-lg font-semibold mb-4 text-shadow">Two-Factor Authentication</h3>
                      <p className="text-gray/70 mb-4">Add an extra layer of security to your account</p>
                      <Button
                        variant="outline"
                        className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                      >
                        Enable 2FA
                      </Button>
                    </div>
                  </Card>
                )}

                {activeTab === "preferences" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Preferences</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-shadow">Notification Preferences</h3>
                        <div className="space-y-3">
                          {[
                            { id: "booking_updates", label: "Booking updates and confirmations" },
                            { id: "payment_reminders", label: "Payment reminders" },
                            { id: "new_artists", label: "New artist recommendations" },
                            { id: "promotional", label: "Promotional offers and updates" },
                          ].map((pref) => (
                            <label key={pref.id} className="flex items-center space-x-3">
                              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                              <span className="text-gray/80">{pref.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-shadow">Communication</h3>
                        <div className="space-y-3">
                          {[
                            { id: "email", label: "Email notifications" },
                            { id: "sms", label: "SMS notifications" },
                            { id: "push", label: "Push notifications" },
                          ].map((comm) => (
                            <label key={comm.id} className="flex items-center space-x-3">
                              <input type="checkbox" defaultChecked className="rounded border-white/20 bg-white/5" />
                              <span className="text-gray/80">{comm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Button className="glow-button">
                        <Save className="w-4 h-4 mr-2" />
                        Save Preferences
                      </Button>
                    </div>
                  </Card>
                )}

                {activeTab === "billing" && (
                  <Card className="glass-card p-8">
                    <h2 className="text-2xl font-semibold mb-6 text-shadow">Billing Information</h2>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-shadow">Payment Methods</h3>
                        <div className="space-y-3">
                          <Card className="glass-card p-4 border border-white/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <CreditCard className="w-8 h-8 text-gray/70" />
                                <div>
                                  <p className="font-medium text-shadow">•••• •••• •••• 4242</p>
                                  <p className="text-sm text-gray/60">Expires 12/25</p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="glass-card border-red-500/20 text-red-400 hover:bg-red-500/10 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </Card>
                        </div>
                        <Button
                          variant="outline"
                          className="mt-4 glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                        >
                          Add Payment Method
                        </Button>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4 text-shadow">Billing History</h3>
                        <div className="space-y-3">
                          {[
                            { date: "Jan 15, 2024", amount: "LKR 25,000", description: "Booking: Kasun Perera" },
                            { date: "Dec 20, 2023", amount: "LKR 20,000", description: "Booking: Nimali Fernando" },
                          ].map((transaction, index) => (
                            <Card key={index} className="glass-card p-4 border border-white/10">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-shadow">{transaction.description}</p>
                                  <p className="text-sm text-gray/60">{transaction.date}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-semibold gradient-text">{transaction.amount}</p>
                                  <Button variant="ghost" size="sm" className="text-gray/60 hover:text-gray text-xs">
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
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
