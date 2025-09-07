"use client"

import type React from "react"

import { useState } from "react"
import { X, Calendar, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "./notifications/notification-provider"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  performer: {
    id: string
    name: string
    category: string
    hourlyRate: number
    eventRate: number
    location: string
    image: string
  }
}

export function BookingModal({ isOpen, onClose, performer }: BookingModalProps) {
  const [bookingType, setBookingType] = useState<"hourly" | "event">("event")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [duration, setDuration] = useState("4")
  const [venue, setVenue] = useState("")
  const [eventType, setEventType] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const { addNotification } = useNotifications()

  const calculateTotal = () => {
    if (bookingType === "hourly") {
      return performer.hourlyRate * Number.parseInt(duration)
    }
    return performer.eventRate
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Add success notification
    addNotification({
      type: "booking",
      title: "Booking Request Sent",
      message: `Your booking request for ${performer.name} has been sent successfully. You'll receive a confirmation soon.`,
      priority: "high",
      actionUrl: "/client/bookings",
    })

    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray">Book {performer.name}</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray/60 hover:text-gray transition-colors rounded-full hover:bg-white/10"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Performer Info */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-white/5 rounded-2xl">
            <img
              src={performer.image || "/placeholder.svg"}
              alt={performer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-gray font-semibold text-lg">{performer.name}</h3>
              <p className="text-red-400">{performer.category}</p>
              <div className="flex items-center gap-2 text-gray/60 text-sm">
                <MapPin className="w-4 h-4" />
                {performer.location}
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Booking Type */}
            <div>
              <label className="block text-gray font-medium mb-3">Booking Type</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setBookingType("event")}
                  className={`p-4 rounded-xl border transition-all ${
                    bookingType === "event"
                      ? "border-red-500 bg-red-500/20 text-gray"
                      : "border-white/20 bg-white/5 text-gray/80 hover:bg-white/10"
                  }`}
                >
                  <Calendar className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Full Event</div>
                  <div className="text-sm opacity-80">LKR {performer.eventRate.toLocaleString()}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType("hourly")}
                  className={`p-4 rounded-xl border transition-all ${
                    bookingType === "hourly"
                      ? "border-red-500 bg-red-500/20 text-gray"
                      : "border-white/20 bg-white/5 text-gray/80 hover:bg-white/10"
                  }`}
                >
                  <Clock className="w-6 h-6 mx-auto mb-2" />
                  <div className="font-medium">Hourly Rate</div>
                  <div className="text-sm opacity-80">LKR {performer.hourlyRate.toLocaleString()}/hr</div>
                </button>
              </div>
            </div>

            {/* Event Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray font-medium mb-2">Event Date</label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray placeholder-white/50 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray font-medium mb-2">Event Time</label>
                <input
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray placeholder-white/50 focus:border-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {bookingType === "hourly" && (
              <div>
                <label className="block text-gray font-medium mb-2">Duration (hours)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray focus:border-red-500 focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((hour) => (
                    <option key={hour} value={hour} className="bg-gray-800">
                      {hour} hour{hour > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-gray font-medium mb-2">Venue/Location</label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Enter event venue or location"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray placeholder-white/50 focus:border-red-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray font-medium mb-2">Event Type</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray focus:border-red-500 focus:outline-none"
                required
              >
                <option value="" className="bg-gray-800">
                  Select event type
                </option>
                <option value="wedding" className="bg-gray-800">
                  Wedding
                </option>
                <option value="birthday" className="bg-gray-800">
                  Birthday Party
                </option>
                <option value="corporate" className="bg-gray-800">
                  Corporate Event
                </option>
                <option value="cultural" className="bg-gray-800">
                  Cultural Event
                </option>
                <option value="religious" className="bg-gray-800">
                  Religious Function
                </option>
                <option value="other" className="bg-gray-800">
                  Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-gray font-medium mb-2">Special Requests (Optional)</label>
              <textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special songs, requirements, or notes for the performer..."
                rows={3}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-gray placeholder-white/50 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>

            {/* Total */}
            <div className="bg-white/5 rounded-2xl p-6">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray font-medium">Total Amount:</span>
                <span className="text-2xl font-bold text-red-400">LKR {calculateTotal().toLocaleString()}</span>
              </div>
              <p className="text-gray/60 text-sm mt-2">
                {bookingType === "hourly"
                  ? `${duration} hours × LKR ${performer.hourlyRate.toLocaleString()}/hour`
                  : "Full event booking"}
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-gray font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-red-500/25"
            >
              Send Booking Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
