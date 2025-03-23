"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  Calendar,
  Tag,
  Clock,
  Edit,
  Trash2,
  Star,
  StarHalf,
  Film,
  Users,
} from "lucide-react"

// Sample DVD data
const dvds = [
  {
    id: 7,
    title: "The Shawshank Redemption",
    creator: "Frank Darabont",
    type: "dvd",
    genre: "Drama",
    year: 1994,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    studio: "Columbia Pictures",
    runtime: "142 min",
    rating: "R",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    stars: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    overallRating: 4.9,
    reviews: [
      { user: "Mark", rating: 5, comment: "One of the greatest films ever made. A masterpiece of storytelling." },
      { user: "Nancy", rating: 5, comment: "Powerful performances and a script that keeps you engaged throughout." },
    ],
    borrowHistory: [
      { user: "William Johnson", borrowDate: "2023-01-05", returnDate: "2023-01-20" },
      { user: "Rebecca Smith", borrowDate: "2023-03-15", returnDate: "2023-03-30" },
    ],
  },
  {
    id: 8,
    title: "The Lord of the Rings: The Fellowship of the Ring",
    creator: "Peter Jackson",
    type: "dvd",
    genre: "Fantasy",
    year: 2001,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.",
    studio: "New Line Cinema",
    runtime: "178 min",
    rating: "PG-13",
    language: "English",
    subtitles: ["English", "Spanish", "French", "German"],
    stars: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    overallRating: 4.8,
    reviews: [
      {
        user: "Oliver",
        rating: 5,
        comment: "A perfect adaptation of Tolkien's masterpiece. The visuals and score are breathtaking.",
      },
      {
        user: "Patricia",
        rating: 4,
        comment: "Incredible world-building and characters. A must-watch for any fantasy fan.",
      },
    ],
    borrowHistory: [
      { user: "Daniel Brown", borrowDate: "2023-02-10", returnDate: "2023-02-25" },
      { user: "Amanda Wilson", borrowDate: "2023-04-05", returnDate: "2023-04-20" },
    ],
  },
  {
    id: 9,
    title: "Inception",
    creator: "Christopher Nolan",
    type: "dvd",
    genre: "Science Fiction",
    year: 2010,
    available: false,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    studio: "Warner Bros. Pictures",
    runtime: "148 min",
    rating: "PG-13",
    language: "English",
    subtitles: ["English", "Spanish", "French"],
    stars: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Ellen Page"],
    overallRating: 4.7,
    reviews: [
      { user: "Quinn", rating: 5, comment: "Mind-bending and visually stunning. Nolan at his best." },
      {
        user: "Rachel",
        rating: 4,
        comment: "Complex and thought-provoking. Requires multiple viewings to fully appreciate.",
      },
    ],
    borrowHistory: [
      { user: "Steven Clark", borrowDate: "2023-01-15", returnDate: "2023-01-30" },
      { user: "Jessica Martinez", borrowDate: "2023-05-01", returnDate: null },
    ],
  },
]

export default function DvdDetailPage() {
  const params = useParams()
  const dvdId = Number(params.id)
  const [userRole, setUserRole] = useState("borrower") // Toggle between "borrower" and "librarian" to test

  // Find the DVD with the matching ID
  const dvd = dvds.find((d) => d.id === dvdId)

  // If DVD not found
  if (!dvd) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">DVD Not Found</h1>
          <p className="text-gray-600 mb-6">The DVD you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/catalog"
            className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Link>
        </div>
      </div>
    )
  }

  // Render DVD details
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/catalog" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Catalog</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">{userRole === "borrower" ? "John Doe" : "Admin"}</span>
            </div>
            <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* DVD Cover */}
              <div className="flex-shrink-0">
                <img
                  src={dvd.coverUrl || "/placeholder.svg"}
                  alt={`Cover of ${dvd.title}`}
                  className="w-full md:w-48 object-cover rounded"
                />

                {/* Availability Badge */}
                <div
                  className={`mt-4 text-center py-2 rounded-md ${dvd.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {dvd.available ? "Available" : "Unavailable"}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {userRole === "borrower" && dvd.available && (
                    <Link
                      href={`/borrow/dvd/${dvd.id}`}
                      className="w-full inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                    >
                      Borrow DVD
                    </Link>
                  )}

                  {userRole === "borrower" && !dvd.available && (
                    <button className="w-full inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      Reserve DVD
                    </button>
                  )}

                  {userRole === "librarian" && (
                    <>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit DVD
                      </button>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 shadow transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete DVD
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* DVD Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{dvd.title}</h1>
                <p className="text-xl text-gray-600 mb-4">Directed by {dvd.creator}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(Math.floor(dvd.overallRating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {dvd.overallRating % 1 !== 0 && <StarHalf className="h-5 w-5 fill-current" />}
                  </div>
                  <span className="text-gray-600">{dvd.overallRating} out of 5</span>
                </div>

                {/* DVD Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Released: {dvd.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Genre: {dvd.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Runtime: {dvd.runtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Film className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Studio: {dvd.studio}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Rating: {dvd.rating}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Language: {dvd.language}</span>
                  </div>
                </div>

                {/* Cast */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Cast</h2>
                  <div className="flex flex-wrap gap-2">
                    {dvd.stars.map((star, index) => (
                      <div key={index} className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-gray-700">{star}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subtitles */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Subtitles</h2>
                  <div className="flex flex-wrap gap-2">
                    {dvd.subtitles.map((subtitle, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {subtitle}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DVD Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700">{dvd.description}</p>
                </div>

                {/* Reviews Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {dvd.reviews.map((review, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{review.user}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add Review Button (Borrower Only) */}
                  {userRole === "borrower" && (
                    <button className="mt-4 inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      Write a Review
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Borrowing History (Librarian Only) */}
            {userRole === "librarian" && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Borrowing History</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          User
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Borrow Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Return Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dvd.borrowHistory.map((history, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {history.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{history.borrowDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {history.returnDate || "Not returned"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

