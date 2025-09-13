import { notFound } from "next/navigation"
import { Star, MapPin, Calendar, Clock, DollarSign, Users, Award, Play, ImageIcon } from "lucide-react"

// Mock performer data
const performers = {
  "1": {
    id: "1",
    name: "Kasun Perera",
    category: "Traditional Singer",
    location: "Colombo, Sri Lanka",
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 15000,
    eventRate: 75000,
    experience: "8+ years",
    languages: ["Sinhala", "English", "Tamil"],
    specialties: ["Wedding Ceremonies", "Cultural Events", "Religious Functions"],
    bio: "Award-winning traditional singer specializing in classical Sinhala music and wedding ceremonies. With over 8 years of experience, I bring authentic Sri Lankan musical traditions to your special events.",
    images: ["/sri-lankan-male-singer.png", "/sri-lankan-singer.png", "/sri-lankan-wedding-singer.png"],
    videos: [
      { title: "Traditional Wedding Song", thumbnail: "/wedding-song-performance.png" },
      { title: "Cultural Festival Performance", thumbnail: "/cultural-festival-singer.png" },
    ],
    availability: {
      weekdays: true,
      weekends: true,
      evenings: true,
    },
    equipment: ["Professional Sound System", "Wireless Microphones", "Traditional Instruments"],
    achievements: ["Best Traditional Singer 2023", "Cultural Heritage Award", "500+ Successful Events"],
  },
}

export default function PerformerProfile({ params }: { params: { id: string } }) {
  const performer = performers[params.id as keyof typeof performers]

  if (!performer) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3">
              <div className="relative group">
                <img
                  src={performer.images[0] || "/placeholder.svg"}
                  alt={performer.name}
                  className="w-full aspect-square object-cover rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <div className="lg:w-2/3">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray mb-2">{performer.name}</h1>
                  <p className="text-xl text-red-400 mb-4">{performer.category}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-gray font-semibold">{performer.rating}</span>
                    <span className="text-gray/60">({performer.reviewCount} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray/80">
                    <MapPin className="w-4 h-4" />
                    <span>{performer.location}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray/80 text-lg mb-6 leading-relaxed">{performer.bio}</p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Clock className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-gray/60 text-sm">Experience</p>
                  <p className="text-gray font-semibold">{performer.experience}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-gray/60 text-sm">Hourly Rate</p>
                  <p className="text-gray font-semibold">LKR {performer.hourlyRate.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-gray/60 text-sm">Event Rate</p>
                  <p className="text-gray font-semibold">LKR {performer.eventRate.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-gray/60 text-sm">Languages</p>
                  <p className="text-gray font-semibold">{performer.languages.length}</p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-gray font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-red-500/25">
                Book Now
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray mb-6">Portfolio</h2>

              {/* Images */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-red-400" />
                  Photos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {performer.images.map((image, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${performer.name} portfolio ${index + 1}`}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div>
                <h3 className="text-lg font-semibold text-gray mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-red-400" />
                  Performance Videos
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {performer.videos.map((video, index) => (
                    <div key={index} className="relative group cursor-pointer">
                      <img
                        src={video.thumbnail || "/placeholder.svg"}
                        alt={video.title}
                        className="w-full aspect-video object-cover rounded-xl"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray" />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-gray font-medium">{video.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray mb-6">Reviews</h2>
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="border-b border-white/10 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-gray font-semibold">
                        P{review}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray font-semibold">Priya Silva</h4>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray/80 mb-2">
                          Amazing performance at our wedding! Kasun&apos;s voice brought tears to everyone&apos;s eyes. Highly
                          professional and punctual. Would definitely book again!
                        </p>
                        <p className="text-gray/50 text-sm">2 weeks ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Info */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray mb-4">Quick Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray/60 text-sm mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {performer.specialties.map((specialty, index) => (
                      <span key={index} className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm">
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-gray/60 text-sm mb-1">Languages</p>
                  <p className="text-gray">{performer.languages.join(", ")}</p>
                </div>
                <div>
                  <p className="text-gray/60 text-sm mb-1">Equipment Provided</p>
                  <ul className="text-gray text-sm space-y-1">
                    {performer.equipment.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Achievements
              </h3>
              <div className="space-y-3">
                {performer.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-gray text-sm">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
              <h3 className="text-xl font-bold text-gray mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-gray font-semibold py-3 px-6 rounded-xl transition-all duration-300">
                  Send Message
                </button>
                <button className="w-full bg-white/10 hover:bg-white/20 text-gray font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-white/20">
                  View Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
