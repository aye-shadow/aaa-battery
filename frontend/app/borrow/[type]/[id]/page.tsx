"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Book,
  Headphones,
  Disc,
} from "lucide-react"

// Add these imports at the top of the file
import { catalogAPI, borrowAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Sample library items data with different types (would come from an API in a real app)
const libraryItems = [
  {
    id: 1,
    title: "The Great Gatsby",
    creator: "F. Scott Fitzgerald",
    type: "book",
    genre: "Fiction",
    year: 1925,
    available: true,
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "A story of wealth, love, and the American Dream in the 1920s.",
    borrowPeriod: 21, // days
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    creator: "Jane Austen",
    type: "audiobook",
    genre: "Romance",
    year: 2013,
    available: true,
    coverUrl: "/placeholder.svg?height=200&width=150",
    description: "A romantic novel about the Bennet family and the proud Mr. Darcy.",
    narrator: "Rosamund Pike",
    duration: "11h 35m",
    borrowPeriod: 14, // days
  },
  {
    id: 7,
    title: "The Shawshank Redemption",
    creator: "Frank Darabont",
    type: "dvd",
    genre: "Drama",
    year: 1994,
    available: true,
    coverUrl: "/placeholder.svg?height=200&width=150",
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    runtime: "142 min",
    borrowPeriod: 7, // days
  },
]

// Helper function to get the appropriate icon for each item type
const getItemTypeIcon = (type) => {
  switch (type) {
    case "book":
      return <Book className="h-5 w-5" />
    case "audiobook":
      return <Headphones className="h-5 w-5" />
    case "dvd":
      return <Disc className="h-5 w-5" />
    default:
      return <Book className="h-5 w-5" />
  }
}

// Helper function to get the creator label based on item type
const getCreatorLabel = (type) => {
  switch (type) {
    case "book":
      return "Author"
    case "audiobook":
      return "Author"
    case "dvd":
      return "Director"
    default:
      return "Creator"
  }
}

// Helper function to format date as YYYY-MM-DD
const formatDate = (date) => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      // If date is invalid, return today's date
      const today = new Date()
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  } catch (error) {
    console.error("Error formatting date:", error)
    // Return today's date as fallback
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  }
}

// Helper function to add days to a date
const addDays = (date, days) => {
  try {
    const result = new Date(date)
    if (isNaN(result.getTime())) {
      // If input date is invalid, use today as base
      const today = new Date()
      today.setDate(today.getDate() + (days || 0))
      return today
    }
    result.setDate(result.getDate() + (days || 0))
    return result
  } catch (error) {
    console.error("Error adding days to date:", error)
    // Return today + days as fallback
    const today = new Date()
    today.setDate(today.getDate() + (days || 0))
    return today
  }
}

export default function BorrowRequestPage() {
  const params = useParams()
  const router = useRouter()
  const { type, id } = params
  const itemId = Number(id)

  // Add this line inside the component, near the top with other hooks
  const { apiToast } = useToast()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [borrowDate, setBorrowDate] = useState(formatDate(new Date()))
  const [returnDate, setReturnDate] = useState("")
  const [borrowPeriod, setBorrowPeriod] = useState("default")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [processingIds, setProcessingIds] = useState([])

  // const catalogAPI = {
  //   getItemById: async (type, id) => {
  //     // Simulate API call
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         const foundItem = libraryItems.find((item) => item.id === id && item.type === type)
  //         resolve({ data: foundItem })
  //       }, 500)
  //     })
  //   },
  // }

  // const borrowAPI = {
  //   submitBorrowRequest: async (borrowData) => {
  //     // Simulate API call
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve({ data: { success: true } })
  //       }, 1000)
  //     })
  //   },
  // }

  // const apiToast = (title, description, method, endpoint, type) => {
  //   console.log(`API Toast: ${title} - ${description} (${method} ${endpoint}) - Type: ${type}`)
  // }

  // Fetch item data
  useEffect(() => {
    const fetchItemData = async () => {
      setProcessingIds((prev) => [...prev, itemId])
      setLoading(true)

      try {
        // Call the API to get item details
        const response = await catalogAPI.getItemById(type, itemId)

        // Show success toast with API details
        apiToast(
          "Item Details Loaded",
          "Item details have been fetched successfully.",
          "GET",
          `/api/catalog/${type}/${itemId}`,
          "info",
        )

        // Set the found item
        setItem(response.data)

        if (response.data) {
          try {
            // Set default return date based on item's borrow period
            // Use a safer approach to handle dates
            const today = new Date()
            const defaultReturnDate = new Date(today)
            defaultReturnDate.setDate(today.getDate() + (response.data.borrowPeriod || 14))
            setReturnDate(formatDate(defaultReturnDate))
          } catch (error) {
            console.error("Error setting default return date:", error)
            // Fallback to a default 14-day period if there's an issue
            const fallbackDate = new Date()
            fallbackDate.setDate(fallbackDate.getDate() + 14)
            setReturnDate(formatDate(fallbackDate))
          }
        }
      } catch (error) {
        console.error("Error fetching item details:", error)

        // Show error toast with API details
        apiToast(
          "Error Loading Item",
          "Failed to fetch item details. Please try again.",
          "GET",
          `/api/catalog/${type}/${itemId}`,
          "destructive",
        )
      } finally {
        setProcessingIds((prev) => prev.filter((id) => id !== itemId))
        setLoading(false)
      }
    }

    fetchItemData()
  }, [itemId, type, apiToast])

  // Handle borrow period change
  const handleBorrowPeriodChange = (e) => {
    const period = e.target.value
    setBorrowPeriod(period)

    try {
      if (period === "default" && item?.borrowPeriod) {
        // Set to default borrow period for this item type
        const defaultReturnDate = addDays(new Date(borrowDate), item.borrowPeriod)
        setReturnDate(formatDate(defaultReturnDate))
      } else {
        // Set to selected custom period
        const days = Number.parseInt(period) || 14 // Default to 14 days if parsing fails
        const newReturnDate = addDays(new Date(borrowDate), days)
        setReturnDate(formatDate(newReturnDate))
      }
    } catch (error) {
      console.error("Error calculating return date:", error)
      // Set a fallback return date (today + 14 days)
      const fallbackDate = new Date()
      fallbackDate.setDate(fallbackDate.getDate() + 14)
      setReturnDate(formatDate(fallbackDate))
    }
  }

  // Handle borrow date change
  const handleBorrowDateChange = (e) => {
    const newBorrowDate = e.target.value
    setBorrowDate(newBorrowDate)

    try {
      // Update return date based on selected borrow period
      let days = item?.borrowPeriod || 14 // Default to 14 days if item.borrowPeriod is undefined
      if (borrowPeriod !== "default") {
        days = Number.parseInt(borrowPeriod) || 14 // Default to 14 days if parsing fails
      }

      const borrowDateObj = new Date(newBorrowDate)
      if (isNaN(borrowDateObj.getTime())) {
        // If borrow date is invalid, use today
        const today = new Date()
        const newReturnDate = addDays(today, days)
        setReturnDate(formatDate(newReturnDate))
      } else {
        const newReturnDate = addDays(borrowDateObj, days)
        setReturnDate(formatDate(newReturnDate))
      }
    } catch (error) {
      console.error("Error updating return date:", error)
      // Set a fallback return date (today + 14 days)
      const fallbackDate = new Date()
      fallbackDate.setDate(fallbackDate.getDate() + 14)
      setReturnDate(formatDate(fallbackDate))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      // Prepare borrow request data
      const borrowData = {
        userId: 101, // Assuming user ID 101 (John Doe)
        itemId: item.id,
        borrowDate,
        returnDate,
        notes,
      }

      // Show API toast for the borrow request
      apiToast("Processing Borrow Request", "Submitting your borrow request...", "POST", "/api/borrows", "info")

      // Call the API to submit the borrow request
      const response = await borrowAPI.submitBorrowRequest(borrowData)

      // Show success toast with API details
      apiToast(
        "Borrow Request Submitted",
        "Your request has been submitted successfully.",
        "POST",
        "/api/borrows",
        "success",
      )

      setIsSubmitting(false)
      setSubmitSuccess(true)

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard/borrower")
      }, 2000)
    } catch (error) {
      console.error("Error submitting borrow request:", error)

      // Show error toast with API details
      apiToast(
        "Borrow Request Failed",
        "Failed to submit your borrow request. Please try again.",
        "POST",
        "/api/borrows",
        "destructive",
      )

      setIsSubmitting(false)
    }
  }

  // If item not found or not available
  if (!loading && (!item || !item.available)) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{!item ? "Item Not Found" : "Item Not Available"}</h1>
          <p className="text-gray-600 mb-6">
            {!item
              ? "The item you're trying to borrow doesn't exist or has been removed."
              : "This item is currently not available for borrowing. You can place a reservation instead."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Catalog
            </Link>
            {!item ? null : (
              <Link
                href={`/catalog/${type}/${id}`}
                className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                View Item Details
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#39FF14] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    )
  }

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
            <Link href={`/catalog/${type}/${id}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Item Details</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">John Doe</span>
            </div>
            <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {submitSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
            <CheckCircle className="h-16 w-16 text-[#39FF14] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Borrow Request Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Your request to borrow "{item.title}" has been submitted successfully. You will be redirected to your
              dashboard shortly.
            </p>
            <Link
              href="/dashboard/borrower"
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-6">Borrow Request</h1>

              {/* Item Details */}
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-shrink-0">
                  <img
                    src={item.coverUrl || "/placeholder.svg"}
                    alt={`Cover of ${item.title}`}
                    className="w-full md:w-40 object-cover rounded"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getItemTypeIcon(item.type)}
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                      {item.type}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {getCreatorLabel(item.type)}: {item.creator}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.genre}</span>
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.year}</span>
                    {item.type === "audiobook" && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.duration}</span>
                    )}
                    {item.type === "dvd" && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.runtime}</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>

              {/* Borrowing Form */}
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label htmlFor="borrowDate" className="block text-sm font-medium text-gray-700">
                      Borrow Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="borrowDate"
                        type="date"
                        className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        value={borrowDate}
                        onChange={handleBorrowDateChange}
                        min={formatDate(new Date())}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="borrowPeriod" className="block text-sm font-medium text-gray-700">
                      Borrow Period
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        id="borrowPeriod"
                        className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        value={borrowPeriod}
                        onChange={handleBorrowPeriodChange}
                        required
                      >
                        <option value="default">Default ({item.borrowPeriod} days)</option>
                        <option value="7">1 week (7 days)</option>
                        <option value="14">2 weeks (14 days)</option>
                        <option value="21">3 weeks (21 days)</option>
                        <option value="28">4 weeks (28 days)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">
                      Expected Return Date
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="returnDate"
                        type="date"
                        className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        value={returnDate}
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      This date is calculated based on your selected borrow period.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      rows={3}
                      placeholder="Any special requests or notes for the librarian"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                {/* Confirmation Area */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                  <h3 className="font-medium text-gray-800 mb-2">Confirmation</h3>
                  <p className="text-gray-600 mb-4">
                    By submitting this request, you agree to return the item by the expected return date. Late returns
                    may incur fines according to library policy.
                  </p>
                  <div className="flex items-center">
                    <input
                      id="confirm"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-[#39FF14] focus:ring-[#39FF14]"
                      required
                    />
                    <label htmlFor="confirm" className="ml-2 block text-sm text-gray-700">
                      I understand and agree to the borrowing terms
                    </label>
                  </div>
                </div>

                {/* Error message */}
                {submitError && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{submitError}</div>}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Link
                    href={`/catalog/${type}/${id}`}
                    className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                        Processing...
                      </>
                    ) : (
                      "Submit Request"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

