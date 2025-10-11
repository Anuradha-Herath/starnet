"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth/AuthGuard"
import { Navigation } from "@/components/navigation"
import { Music, Search, Star, MapPin, Heart, Bell, User, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SearchArtistsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { id: "all", name: "All Artists" },
    { id: "musicians", name: "Musicians" },
    { id: "singers", name: "Singers" },
    { id: "dancers", name: "Dancers" },
    { id: "djs", name: "DJs" },
    { id: "bands", name: "Bands" },
  ]

  const artists = [
    {
      id: 1,
      name: "Kasun Perera",
      category: "Singer",
      location: "Colombo",
      rating: 4.9,
      reviews: 127,
      price: "LKR 25,000",
      image: "/sri-lankan-male-singer.png",
      verified: true,
      tags: ["Wedding", "Corporate", "Private Events"],
      availability: "Available",
      responseTime: "Within 2 hours",
    },
    {
      id: 2,
      name: "Nimali Fernando",
      category: "Classical Dancer",
      location: "Kandy",
      rating: 4.8,
      reviews: 89,
      price: "LKR 20,000",
      image: "/sri-lankan-dancer.png",
      verified: true,
      tags: ["Cultural Events", "Weddings", "Festivals"],
      availability: "Available",
      responseTime: "Within 4 hours",
    },
    {
      id: 3,
      name: "The Rhythm Band",
      category: "Band",
      location: "Galle",
      rating: 4.7,
      reviews: 156,
      price: "LKR 75,000",
      image: "/sri-lankan-music-band.png",
      verified: true,
      tags: ["Concerts", "Weddings", "Corporate"],
      availability: "Busy until Jan 20",
      responseTime: "Within 1 hour",
    },
  ]

  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 text-shadow">
                Find <span className="gradient-text">Artists</span>
              </h1>
              <p className="text-gray/70">Discover and book talented performers for your events</p>
            </div>

            {/* Search and Filters */}
            <Card className="glass-card p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray/50" />
                  <Input
                    placeholder="Search artists, categories, or locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 glass-card bg-white/5 border-white/20 text-gray placeholder:text-gray/50 focus:border-primary/50"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id
                        ? "glow-button"
                        : "glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                    }
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Advanced Filters */}
              {showFilters && (
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray/70 mb-2">Location</label>
                      <Input
                        placeholder="Enter city or area"
                        className="glass-card bg-white/5 border-white/20 text-gray placeholder:text-gray/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray/70 mb-2">Budget Range</label>
                      <Input
                        placeholder="Max budget (LKR)"
                        className="glass-card bg-white/5 border-white/20 text-gray placeholder:text-gray/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray/70 mb-2">Event Date</label>
                      <Input type="date" className="glass-card bg-white/5 border-white/20 text-gray" />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray/70">{artists.length} artists found</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray/60">Sort by:</span>
                <Button variant="ghost" className="text-gray/70 hover:text-gray text-sm">
                  Relevance
                </Button>
              </div>
            </div>

            {/* Artists Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <Card key={artist.id} className="glass-card overflow-hidden group">
                  <div className="relative">
                    <img
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      className="w-full h-64 object-cover group-hover:scale-105 smooth-transition"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {artist.verified && <Badge className="bg-green-500/80 text-gray">Verified</Badge>}
                      <Badge
                        className={
                          artist.availability === "Available"
                            ? "bg-green-500/80 text-gray"
                            : "bg-yellow-500/80 text-gray"
                        }
                      >
                        {artist.availability}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="absolute top-4 right-4 text-gray hover:bg-white/20">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-shadow mb-1">{artist.name}</h3>
                        <p className="text-gray/70">{artist.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{artist.rating}</span>
                        </div>
                        <p className="text-sm text-gray/60">({artist.reviews})</p>
                      </div>
                    </div>

                    <div className="flex items-center text-gray/60 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{artist.location}</span>
                    </div>

                    <p className="text-sm text-gray/60 mb-4">Responds {artist.responseTime}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {artist.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-white/10 text-gray/80 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray/60">Starting from</p>
                        <p className="text-lg font-semibold gradient-text">{artist.price}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/artist/${artist.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="glass-card border-white/20 text-gray hover:bg-white/10 bg-transparent"
                          >
                            View Profile
                          </Button>
                        </Link>
                        <Link href={`/client/book/${artist.id}`}>
                          <Button size="sm" className="glow-button">
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button className="glow-button px-8 py-3">Load More Artists</Button>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
