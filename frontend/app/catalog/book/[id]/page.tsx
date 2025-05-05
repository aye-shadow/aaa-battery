"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { catalogAPI } from "@/lib/api/catalog"
import { borrowAPI } from "@/lib/api/borrow"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  Calendar,
  Tag,
  BookMarked,
  Edit,
  Trash2,
  Star,
  StarHalf,
} from "lucide-react"

export default function BookDetailPage() {
  const params = useParams()
  const bookId = Number(params.id)
  const [book, setBook] = useState<any>(null)
  const [availableCopies, setAvailableCopies] = useState(0)
  const [userRole, setUserRole] = useState<"borrower" | "librarian" | null>(null)
  const [reviews, setReviews] = useState<any[]>([])

  useEffect(() => {
    const role = localStorage.getItem("userRole") as "borrower" | "librarian" | null
    setUserRole(role || "borrower")
  }, [])

  useEffect(() => {
    async function fetchBookAndReviews() {
      try {
        const data = await catalogAPI.getItemById("book", bookId)
        if (data) {
          setBook(data)
          setAvailableCopies(data.availableCopies || 0)

          // Fetch reviews by bookId
          const reviewsData = await borrowAPI.getReviews(bookId)
          setReviews(reviewsData)
        }
      } catch (error) {
        console.error("Failed to fetch book or reviews:", error)
      }
    }
    fetchBookAndReviews()
  }, [bookId])

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Book Not Found</h1>
          <p className="text-gray-600 mb-6">The book you're looking for doesn't exist or has been removed.</p>
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
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

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img
                  src={book.coverUrl}
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=150"
                  }}
                  alt={`Cover of ${book.title}`}
                  className="h-48 object-cover rounded"
                />
                <div
                  className={`mt-4 text-center py-2 rounded-md ${
                    availableCopies > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {availableCopies > 0 ? `Available (${availableCopies} copies)` : "Unavailable"}
                </div>
                <div className="mt-4 space-y-2">
                  {userRole === "borrower" && availableCopies > 0 && (
                    <Link
                      href={{
                        pathname: `/borrow/book/${book.id}`,
                        query: { title: book.title, coverUrl: book.coverUrl, creator: book.creator, type: book.type },
                      }}
                      className="w-full inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
                    >
                      Borrow Book
                    </Link>
                  )}
                  {userRole === "librarian" && (
                    <>
                      <Link
                        href={`/catalog/update/${book.id}`}
                        className="w-full inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Book
                      </Link>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 shadow hover:bg-red-200">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Book
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Book Details */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{book.title}</h1>
                <p className="text-xl text-gray-600 mb-4">by {book.creator}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <InfoRow Icon={Calendar} label="Published" value={book.year || "Unknown"} />
                  <InfoRow Icon={Tag} label="Genre" value={book.genre || "Unknown"} />
                  <InfoRow Icon={BookMarked} label="Pages" value="300" />
                  <InfoRow Icon={BookOpen} label="Publisher" value={book.publisher || "Unknown"} />
                  <InfoRow Icon={Tag} label="Language" value="English" />
                  <InfoRow Icon={Tag} label="ISBN" value="978-0000000000" />
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700">{book.description}</p>
                </div>

                {/* Reviews Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet</p>
                  ) : (
                    reviews.map((review) => (
                      <div key={review.reviewId} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{review.reviewerName}</span>
                          <div className="flex text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                            {review.rating % 1 !== 0 && <StarHalf className="h-4 w-4 fill-current" />}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ Icon, label, value }: { Icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-[#39FF14]" />
      <span className="text-gray-700">
        {label}: {value}
      </span>
    </div>
  )
}
