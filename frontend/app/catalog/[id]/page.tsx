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
  Clock,
  Tag,
  BookMarked,
  Edit,
  Trash2,
  Star,
  StarHalf,
} from "lucide-react"

// Sample book data (would normally come from an API)
const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    year: 1925,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, near New York City, the novel depicts first-person narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
    publisher: "Charles Scribner's Sons",
    isbn: "978-0743273565",
    pages: 180,
    language: "English",
    rating: 4.5,
    reviews: [
      { user: "Alice", rating: 5, comment: "A true classic that captures the essence of the American Dream." },
      { user: "Bob", rating: 4, comment: "Beautifully written, though the characters can be frustrating." },
    ],
    borrowHistory: [
      { user: "John Smith", borrowDate: "2023-01-15", returnDate: "2023-02-01" },
      { user: "Sarah Johnson", borrowDate: "2023-03-10", returnDate: "2023-03-25" },
    ],
    type: "book",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960,
    available: true,
    coverUrl: "/placeholder.svg?height=300&width=200",
    description:
      "To Kill a Mockingbird is a novel by the American author Harper Lee. It was published in 1960 and was instantly successful. In the United States, it is widely read in high schools and middle schools. To Kill a Mockingbird has become a classic of modern American literature, winning the Pulitzer Prize.",
    publisher: "J. B. Lippincott & Co.",
    isbn: "978-0061120084",
    pages: 281,
    language: "English",
    rating: 4.8,
    reviews: [
      { user: "Charlie", rating: 5, comment: "One of the most important American novels ever written." },
      { user: "Diana", rating: 5, comment: "A powerful exploration of racial injustice and moral growth." },
    ],
    borrowHistory: [
      { user: "Michael Brown", borrowDate: "2023-02-05", returnDate: "2023-02-20" },
      { user: "Emily Davis", borrowDate: "2023-04-12", returnDate: "2023-04-28" },
    ],
    type: "book",
  },
]

export default function BookDetailPage() {
  const params = useParams()
  const bookId = Number(params.id)
  const [userRole, setUserRole] = useState("borrower") // Toggle between "borrower" and "librarian" to test

  // Find the book with the matching ID
  const book = books.find((b) => b.id === bookId)

  // If book not found
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

  // Render book details
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
              {/* Book Cover */}
              <div className="flex-shrink-0">
                <img
                  src={book.coverUrl || "/placeholder.svg"}
                  alt={`Cover of ${book.title}`}
                  className="w-full md:w-48 object-cover rounded"
                />

                {/* Availability Badge */}
                <div
                  className={`mt-4 text-center py-2 rounded-md ${book.available ? "bg-[#39FF14]/20 text-[#39FF14]" : "bg-red-100 text-red-600"}`}
                >
                  {book.available ? "Available" : "Unavailable"}
                </div>

                {/* Action Buttons */}
                <div className="mt-4 space-y-2">
                  {userRole === "borrower" && book.available && (
                    <Link
                      href={`/borrow/${book.type || "book"}/${book.id}`}
                      className="w-full inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                    >
                      Borrow Book
                    </Link>
                  )}

                  {userRole === "borrower" && !book.available && (
                    <button className="w-full inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300">
                      Reserve Book
                    </button>
                  )}

                  {userRole === "librarian" && (
                    <>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Book
                      </button>
                      <button className="w-full inline-flex items-center justify-center rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-600 shadow transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300">
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
                <p className="text-xl text-gray-600 mb-4">by {book.author}</p>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(Math.floor(book.rating))].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                    {book.rating % 1 !== 0 && <StarHalf className="h-5 w-5 fill-current" />}
                  </div>
                  <span className="text-gray-600">{book.rating} out of 5</span>
                </div>

                {/* Book Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Published: {book.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Genre: {book.genre}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookMarked className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Pages: {book.pages}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Publisher: {book.publisher}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">Language: {book.language}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-[#39FF14]" />
                    <span className="text-gray-700">ISBN: {book.isbn}</span>
                  </div>
                </div>

                {/* Book Description */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Description</h2>
                  <p className="text-gray-700">{book.description}</p>
                </div>

                {/* Reviews Section */}
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Reviews</h2>
                  <div className="space-y-4">
                    {book.reviews.map((review, index) => (
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
                      {book.borrowHistory.map((history, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {history.user}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{history.borrowDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{history.returnDate}</td>
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
