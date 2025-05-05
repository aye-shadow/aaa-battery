"use client"

import { useState, useEffect } from "react"
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
import { catalogAPI } from "@/lib/api/catalog"
import { borrowAPI } from "@/lib/api/borrow"         // ← ADDED

export default function DvdDetailPage() {
  const params = useParams()
  const dvdId = Number(params.id)
  const [userRole, setUserRole] = useState<"borrower" | "librarian" | null>(null)
  const [dvd, setDvd] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([]) // ← ADDED

  useEffect(() => {
    const role = (localStorage.getItem("userRole") as "borrower" | "librarian") || "librarian"
    setUserRole(role)

    const fetchDvd = async () => {
      try {
        const item = await catalogAPI.getItemById("dvd", dvdId)
        if (item) {
          // keep your dummy enrichments
          setDvd({
            ...item,
            runtime: "142 min",
            rating: "R",
            language: "English",
            subtitles: ["English", "Spanish", "French"],
            stars: ["Dummy Actor 1", "Dummy Actor 2", "Dummy Actor 3"],
            overallRating: 4.8,
            // NOTE: we will ignore this dummy `reviews` below and render real ones
            reviews: [
              { user: "Sample Reviewer 1", rating: 5, comment: "Incredible movie!" },
              { user: "Sample Reviewer 2", rating: 4, comment: "Loved the acting and direction." },
            ],
            borrowHistory: [
              { user: "John Doe", borrowDate: "2024-01-10", returnDate: "2024-01-20" },
              { user: "Jane Smith", borrowDate: "2024-02-15", returnDate: null },
            ],
          })

          // ←—— FETCH REAL REVIEWS
          const real = await borrowAPI.getReviews(item.id)
          setReviews(real)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchDvd()
  }, [dvdId])

  if (userRole === null || dvd === null) return null

  const availableCopiesText = `${dvd.availableCopies} / ${dvd.totalCopies} copies available`

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <Header userRole={userRole} />

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* DVD Cover */}
              <div className="flex-shrink-0">
                <img
                  src={dvd.coverUrl}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=150"
                  }}
                  alt={`Cover of ${dvd.title}`}
                  className="h-48 object-cover rounded"
                />

                <div
                  className={`mt-4 text-center py-2 rounded-md ${
                    dvd.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {dvd.available ? "Available" : "Unavailable"}
                </div>
                <div className="text-center text-gray-500 text-sm mt-2">{availableCopiesText}</div>

                <div className="mt-4 space-y-2">
                  {userRole === "borrower" && dvd.available && (
                    <Link
                      href={{
                        pathname: `/borrow/dvd/${dvd.id}`,
                        query: {
                          title: dvd.title,
                          coverUrl: dvd.coverUrl,
                          creator: dvd.creator,
                          type: dvd.type,
                        },
                      }}
                      className="w-full inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
                    >
                      Borrow DVD
                    </Link>
                  )}
                  {userRole === "librarian" && (
                    <>
                      <Link
                        href={`/catalog/update/${dvd.id}`}
                        className="w-full inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit DVD
                      </Link>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 shadow hover:bg-red-200">
                        <Trash2 className="h-4 w-4 mr-2" /> Delete DVD
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

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoRow Icon={Calendar} text={`Released: ${dvd.year}`} />
                  <InfoRow Icon={Tag} text={`Genre: ${dvd.genre}`} />
                  <InfoRow Icon={Clock} text={`Runtime: ${dvd.runtime}`} />
                  <InfoRow Icon={Film} text={`Studio: ${dvd.publisher || "Unknown"}`} />
                  <InfoRow Icon={Tag} text={`Rating: ${dvd.rating}`} />
                  <InfoRow Icon={Tag} text={`Language: ${dvd.language}`} />
                </div>

                {/* Cast */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Cast</h2>
                  <div className="flex flex-wrap gap-2">
                    {dvd.stars.map((star: string, index: number) => (
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
                    {dvd.subtitles.map((sub: string, index: number) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700">{dvd.description}</p>
                </div>

                {/* Reviews */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-gray-500">No reviews yet</p>
                    ) : (
                      reviews.map((r, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-800">{r.reviewerName}</span>
                            <div className="flex text-yellow-400">
                              {[...Array(r.rating)].map((_, j) => (
                                <Star key={j} className="h-4 w-4 fill-current" />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-700">{r.comment}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Borrowing History */}
            {userRole === "librarian" && <BorrowHistoryTable history={dvd.borrowHistory} />}
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ Icon, text }: { Icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#39FF14]" />
      <span className="text-gray-700">{text}</span>
    </div>
  )
}

function BorrowHistoryTable({ history }: { history: any[] }) {
  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Borrowing History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Borrow Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Return Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((h: any, idx: number) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {h.user}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {h.borrowDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {h.returnDate || "Not returned"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Header({ userRole }: { userRole: string }) {
  return (
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
            <span className="text-gray-800 font-medium">
              {userRole === "borrower" ? "John Doe" : "Admin"}
            </span>
          </div>
          <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
            <LogOut className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
