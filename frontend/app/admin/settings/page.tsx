"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import { Navigation } from "@/components/navigation"
import { RedirectGuard } from "@/components/redirect-guard"
import { Lock, Shield, Key } from "lucide-react"
import { useState } from "react"

export default function AdminSettings() {
  return (
    <RedirectGuard allowedRoles={["admin"]}>
      <AdminSettingsContent />
    </RedirectGuard>
  )
}

function AdminSettingsContent() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    // Add admin password change logic here
    setIsChangingPassword(false)
  }

  const handleRegenerateApiKeys = () => {
    // Add API key regeneration logic
  }

  const handleDeleteAccount = () => {
    // Add admin account deletion logic
    // Should include additional verification steps
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-gray-900">
                Admin <span className="gradient-text">Security</span>
              </h1>
              <p className="text-gray-600">Manage your administrator credentials and access</p>
            </div>

            {/* Change Password Card */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Change Password
                </h2>
                {!isChangingPassword && (
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:bg-gray-100"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    Change Password
                  </Button>
                )}
              </div>

              {isChangingPassword ? (
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-gray-700">
                        Current Password
                      </Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="glass-card mt-1 border-gray-200"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" className="text-gray-700">
                        New Password
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="glass-card mt-1 border-gray-200"
                        required
                        minLength={12}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword" className="text-gray-700">
                        Confirm New Password
                      </Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-card mt-1 border-gray-200"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setIsChangingPassword(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="glow-button">
                      Save Changes
                    </Button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-500">Administrator passwords require at least 12 characters.</p>
              )}
            </Card>

            {/* Danger Zone */}
            <Card className="glass-card p-6 border border-red-100 bg-red-50/50">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Danger Zone
              </h2>
              <div className="space-y-4">
                <div className="pt-4">
                  <h3 className="font-medium text-gray-900 mb-2">Delete Admin Account</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    This will permanently remove your administrator access. 
                    Ensure another admin exists before proceeding. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                  >
                    Delete Admin Account
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}