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
  Headphones,
  Clock,
  Edit,
  Trash2,
  Star,
  StarHalf,
  Play,
  Pause,
} from "lucide-react"

// Sample audiobook data
const audiobooks = [
  {
    id: 4,
    title: "Pride and Prejudice",
    creator: "Jane Austen",
    type: "audiobook",
    genre: "Romance",
    year: 2013,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Pride and Prejudice is a romantic novel by Jane Austen, published in 1813. The story follows the main character Elizabeth Bennet as she deals with issues of manners, upbringing, morality, education, and marriage in the society of the landed gentry of early 19th-century England.",
    publisher: "Audible Studios",
    narrator: "Rosamund Pike",
    duration: "11h 35m",
    language: "English",
    fileFormat: "MP3",
    rating: 4.7,
    reviews: [
      { user: "Grace", rating: 5, comment: "Rosamund Pike's narration is absolutely perfect for this classic." },
      { user: "Henry", rating: 4, comment: "A wonderful way to experience this timeless story." },
    ],
    borrowHistory: [
      { user: "Emma Thompson", borrowDate: "2023-02-10", returnDate: "2023-02-25" },
      { user: "James Wilson", borrowDate: "2023-04-05", returnDate: "2023-04-20" },
    ],
    sampleAudio: "/sample-audio.mp3", // This would be a real audio file path in a production environment
  },
  {
    id: 5,
    title: "The Hobbit",
    creator: "J.R.R. Tolkien",
    type: "audiobook",
    genre: "Fantasy",
    year: 2012,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
    publisher: "HarperCollins",
    narrator: "Andy Serkis",
    duration: "10h 25m",
    language: "English",
    fileFormat: "MP3",
    rating: 4.9,
    reviews: [
      { user: "Ian", rating: 5, comment: "Andy Serkis brings Middle-earth to life in an incredible way." },
      { user: "Julia", rating: 5, comment: "The different voices for each character make this a joy to listen to." },
    ],
    borrowHistory: [
      { user: "Thomas Brown", borrowDate: "2023-01-20", returnDate: "2023-02-05" },
      { user: "Olivia Green", borrowDate: "2023-03-15", returnDate: "2023-03-30" },
    ],
    sampleAudio: "/sample-audio.mp3",
  },
  {
    id: 6,
    title: "Harry Potter and the Sorcerer's Stone",
    creator: "J.K. Rowling",
    type: "audiobook",
    genre: "Fantasy",
    year: 2015,
    available: false,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "Harry Potter has no idea how famous he is. That's because he's being raised by his miserable aunt and uncle who are terrified Harry will learn that he's really a wizard, just as his parents were.",
    publisher: "Pottermore Publishing",
    narrator: "Jim Dale",
    duration: "8h 33m",
    language: "English",
    fileFormat: "MP3",
    rating: 4.8,
    reviews: [
      { user: "Kevin", rating: 5, comment: "Jim Dale's narration is magical, perfect for the wizarding world." },
      { user: "Laura", rating: 4, comment: "A wonderful way to revisit the series, even for longtime fans." },
    ],
    borrowHistory: [
      { user: "Sophie Miller", borrowDate: "2023-02-15", returnDate: "2023-03-01" },
      { user: "Ryan Davis", borrowDate: "2023-05-01", returnDate: null },
    ],
    sampleAudio: "/sample-audio.mp3",
  },
]

export default function AudiobookDetailPage() {
  const params = useParams()
  const audiobookId = Number(params.id)
  const [userRole, setUserRole] = useState("borrower") // Toggle between "borrower" and "librarian" to test
  const [isPlaying, setIsPlaying] = useState(false)

  // Find the audiobook with the matching ID
  const audiobook = audiobooks.find((a) => a.id === audiobookId)

  // If audiobook not found
  if (!audiobook) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Audiobook Not Found</h1>
          <p className="text-gray-600 mb-6">The audiobook you're looking for doesn't exist or has been removed.</p>
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

  // Toggle audio playback (this would control a real audio player in production)
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  // Render audiobook details
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
              {/* Audiobook Cover */}
              <div className="flex-shrink-0">
                <img
                  src={audiobook.coverUrl || "/placeholder.svg"}
                  alt={`Cover of ${audiobook.title}`}
                  className="w-full md:w-48 object-cover rounded"
                />

                {/* Availability Badge */}
                <div
                  className={`mt-4 text-center py-2 rounded-md ${audiobook.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {audiobook.available ? "Available" : "Unavailable"}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {userRole === "borrower" && audiobook.available && (
                    <Link
                      href={`/borrow/audiobook/${audiobook.id}`}
                      className="w-full inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                    >
                      Borrow Audiobook
                    </Link>
                  )}

                  {userRole === "borrower" && !audiobook.available && (
                    <button className="w-full inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      Reserve Audiobook
                    </button>
                  )}

                  {userRole === "librarian" && (
                    <>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Audiobook
                      </button>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 shadow transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Audiobook
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Audiobook Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{audiobook.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {audiobook.creator}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(Math.floor(audiobook.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {audiobook.rating % 1 !== 0 && <StarHalf className="h-5 w-5 fill-current" />}
                  </div>
                  <span className="text-gray-600">{audiobook.rating} out of 5</span>
                </div>

                {/* Audio Sample Player */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Audio Sample</h3>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlayback}
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-[#39FF14] text-black"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                    </button>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#39FF14]"
                        style={{ width: isPlaying ? "30%" : "0%", transition: "width 0.1s linear" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">0:30 / 2:00</span>
                  </div>
                </div>

                {/* Audiobook Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Released: {audiobook.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Genre: {audiobook.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Headphones className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Narrator: {audiobook.narrator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Duration: {audiobook.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Publisher: {audiobook.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Format: {audiobook.fileFormat}</span>
                  </div>
                </div>

                {/* Audiobook Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700">{audiobook.description}</p>
                </div>

                {/* Reviews Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {audiobook.reviews.map((review, index) => (
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
                      {audiobook.borrowHistory.map((history, index) => (
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

