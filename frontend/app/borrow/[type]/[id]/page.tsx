"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
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

import { catalogAPI, borrowAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Helper functions
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

const formatDate = (date) => {
  try {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      const today = new Date()
      return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
    }
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
  } catch (error) {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`
  }
}

const addDays = (date, days) => {
  try {
    const result = new Date(date)
    if (isNaN(result.getTime())) {
      const today = new Date()
      today.setDate(today.getDate() + (days || 0))
      return today
    }
    result.setDate(result.getDate() + (days || 0))
    return result
  } catch (error) {
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

  const searchParams = useSearchParams()
  const title = searchParams.get("title")
  const coverUrl = searchParams.get("coverUrl")
  const creator = searchParams.get("creator")
  const itemType = searchParams.get("type")

  const { toast } = useToast()

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

  useEffect(() => {
    setProcessingIds((prev) => [...prev, itemId])
    setLoading(true)

    try {
      setItem({
        id: itemId,
        title: title || "",
        coverUrl: coverUrl || "",
        creator: creator || "",
        type: itemType || "",
        genre: "",
        year: "",
        available: true,
        borrowPeriod: 14,
      })

      const today = new Date()
      const defaultReturnDate = new Date(today)
      defaultReturnDate.setDate(today.getDate() + 14)
      setReturnDate(formatDate(defaultReturnDate))

      toast({
        title: "Item Details Loaded",
        description: "Item details have been fetched successfully.",
        variant: "info",
      })
    } catch (error) {
      console.error("Error setting item details:", error)

      toast({
        title: "Error Loading Item",
        description: "Failed to load item details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== itemId))
      setLoading(false)
    }
  }, [itemId, title, coverUrl, creator, itemType, toast])

  // Borrow period and borrow date handlers (keep as you wrote)
  const handleBorrowPeriodChange = (e) => {
    const period = e.target.value
    setBorrowPeriod(period)
    try {
      if (period === "default" && item?.borrowPeriod) {
        const defaultReturnDate = addDays(new Date(borrowDate), item.borrowPeriod)
        setReturnDate(formatDate(defaultReturnDate))
      } else {
        const days = Number.parseInt(period) || 14
        const newReturnDate = addDays(new Date(borrowDate), days)
        setReturnDate(formatDate(newReturnDate))
      }
    } catch (error) {
      const fallbackDate = new Date()
      fallbackDate.setDate(fallbackDate.getDate() + 14)
      setReturnDate(formatDate(fallbackDate))
    }
  }

  const handleBorrowDateChange = (e) => {
    const newBorrowDate = e.target.value
    setBorrowDate(newBorrowDate)
    try {
      let days = item?.borrowPeriod || 14
      if (borrowPeriod !== "default") {
        days = Number.parseInt(borrowPeriod) || 14
      }
      const borrowDateObj = new Date(newBorrowDate)
      if (isNaN(borrowDateObj.getTime())) {
        const today = new Date()
        const newReturnDate = addDays(today, days)
        setReturnDate(formatDate(newReturnDate))
      } else {
        const newReturnDate = addDays(borrowDateObj, days)
        setReturnDate(formatDate(newReturnDate))
      }
    } catch (error) {
      const fallbackDate = new Date()
      fallbackDate.setDate(fallbackDate.getDate() + 14)
      setReturnDate(formatDate(fallbackDate))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const borrowData = {
        itemId: item.id,
      }
      console.log("📦 Borrow Request Payload:", borrowData)

      toast({
        title: "Processing Borrow Request",
        description: "Submitting your borrow request...",
        variant: "info",
      })

      const response = await borrowAPI.submitBorrowRequest(borrowData)
      console.log("✅ API Response:", response.data)

      toast({
        title: "Borrow Request Submitted",
        description: "Your request has been submitted successfully.",
        variant: "success",
      })

      setIsSubmitting(false)
      setSubmitSuccess(true)

      setTimeout(() => {
        router.push("/dashboard/borrower")
      }, 2000)
    } catch (error) {
      console.error("❌ Error submitting borrow request:", error)

      toast({
        title: "Borrow Request Failed",
        description: "Failed to submit your borrow request. Please try again.",
        variant: "destructive",
      })

      setIsSubmitting(false)
    }
  }

  // Your entire rest of the render (if loading, if error, form, etc.)
  // ⬇️ ⬇️ ⬇️ 
  // (No change needed — keep your JSX as you wrote.)


  

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
                        src={item.coverUrl}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src ="/placeholder.svg?height=200&width=150"
                        }}
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
