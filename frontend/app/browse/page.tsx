"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Music, Search, Star, MapPin, Filter, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { RedirectGuard } from "@/components/redirect-guard"

export default function BrowseArtistsPage() {
  return (
    <RedirectGuard allowedRoles={["client"]}>
      <BrowseArtistsContent />
    </RedirectGuard>
  )
}

function BrowseArtistsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

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
    },
    {
      id: 4,
      name: "DJ Saman",
      category: "DJ",
      location: "Colombo",
      rating: 4.9,
      reviews: 203,
      price: "LKR 30,000",
      image: "/sri-lankan-dj.png",
      verified: true,
      tags: ["Parties", "Weddings", "Club Events"],
    },
    {
      id: 5,
      name: "Ravi Guitar",
      category: "Musician",
      location: "Negombo",
      rating: 4.6,
      reviews: 74,
      price: "LKR 15,000",
      image: "/sri-lankan-guitarist.png",
      verified: false,
      tags: ["Acoustic", "Restaurants", "Private"],
    },
    {
      id: 6,
      name: "Chamari Voice",
      category: "Singer",
      location: "Matara",
      rating: 4.8,
      reviews: 92,
      price: "LKR 22,000",
      image: "/sri-lankan-female-singer.png",
      verified: true,
      tags: ["Pop", "Jazz", "Corporate"],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-card border-0 border-b border-white/10 rounded-none backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-light flex items-center justify-center">
                <Music className="w-6 h-6 text-gray" />
              </div>
              <span className="text-2xl font-bold gradient-text">StarNet</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost" className="text-gray-700 hover:bg-gray-100">
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="glow-button">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 smooth-transition"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow">
              Browse <span className="gradient-text">Artists</span>
            </h1>
            <p className="text-xl text-gray-700">Discover talented performers across Sri Lanka</p>
          </div>

          {/* Search and Filters */}
          <Card className="glass-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  placeholder="Search artists, categories, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass-card bg-white/50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:border-primary/50"
                />
              </div>
              <Button
                variant="outline"
                className="glass-card border-gray-200 text-gray-700 hover:bg-gray-100 bg-transparent"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "glow-button"
                      : "glass-card border-gray-200 text-gray-700 hover:bg-gray-100 bg-transparent"
                  }
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </Card>

          {/* Artists Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <Card key={artist.id} className="glass-card overflow-hidden group cursor-pointer">
                <div className="relative">
                  <img
                    src={artist.image || "/placeholder.svg"}
                    alt={artist.name}
                    className="w-full h-64 object-cover group-hover:scale-105 smooth-transition"
                  />
                  {artist.verified && (
                    <Badge className="absolute top-4 right-4 bg-green-500/80 text-gray">Verified</Badge>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">{artist.name}</h3>
                      <p className="text-gray-600">{artist.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-medium text-gray-900">{artist.rating}</span>
                      </div>
                      <p className="text-sm text-gray-500">({artist.reviews} reviews)</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{artist.location}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {artist.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Starting from</p>
                      <p className="text-lg font-semibold gradient-text">{artist.price}</p>
                    </div>
                    <Link href={`/artist/${artist.id}`}>
                      <Button className="glow-button">View Profile</Button>
                    </Link>
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
  )
}
