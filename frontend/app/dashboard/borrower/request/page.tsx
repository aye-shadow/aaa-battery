// app/dashboard/borrower/requests/new/page.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  CheckCircle,
  AlertCircle,
  BookPlus,
} from "lucide-react"
import { requestAPI } from "@/lib/api/request"
import { useToast } from "@/hooks/use-toast"

const bookCategories = [
  "Fiction",
  "Non-Fiction",
  "Science Fiction",
  "Fantasy",
  "Mystery",
  "Thriller",
  "Romance",
  "Historical Fiction",
  "Biography",
  "Self-Help",
  "Business",
  "Science",
  "Technology",
  "Art",
  "Poetry",
  "Children's",
  "Young Adult",
  "Other",
]

const contentTypes = [
  "Book",
  "Audiobook",
  "DVD",
  "E-Book",
  "Journal",
  "Magazine",
  "Other",
]

export default function NewBookRequestPage() {
  const router = useRouter()
  const { apiToast } = useToast()

  const [requests, setRequests] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [contentType, setContentType] = useState("Book")
  const [category, setCategory] = useState("")
  const [isbn, setIsbn] = useState("")
  const [publicationYear, setPublicationYear] = useState("")
  const [description, setDescription] = useState("")
  const [reason, setReason] = useState("")
  const [urgency, setUrgency] = useState("normal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [errors, setErrors] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  })

  // ─── fetch already‐made requests ───────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const data = await requestAPI.getUserRequests()
        setRequests(data)
      } catch (e) {
        console.error("Failed to load your requests:", e)
      }
    }
    load()
  }, [])

  const validateForm = () => {
    let valid = true
    const newErrors = { title: "", author: "", category: "", description: "" }
    if (!title.trim()) {
      newErrors.title = "Title is required"
      valid = false
    }
    if (!author.trim()) {
      newErrors.author = "Author/Creator is required"
      valid = false
    }
    if (!category) {
      newErrors.category = "Category is required"
      valid = false
    }
    if (!description.trim()) {
      newErrors.description = "Description is required"
      valid = false
    }
    setErrors(newErrors)
    if (!valid) {
      apiToast(
        "Validation Error",
        "Please fill in all required fields.",
        "POST",
        "/request/borrower/new-request",
        "destructive"
      )
    }
    return valid
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    setSubmitError("")

    try {
      let typeLower = contentType.toLowerCase()
      if (!["book", "audiobook", "dvd"].includes(typeLower)) {
        typeLower = "book"
      }
      const requestData = {
        itemType: typeLower,
        itemName: title,
        itemBy: author,
        notes: reason || "",
      }
      apiToast(
        "Processing Request",
        "Submitting your content request…",
        "POST",
        "/request/borrower/new-request",
        "info"
      )
      await requestAPI.submitContentRequest(requestData)
      apiToast(
        "Request Submitted",
        "Your content request has been submitted successfully.",
        "POST",
        "/request/borrower/new-request",
        "success"
      )
      setSubmitSuccess(true)
      setIsSubmitting(false)
      setTimeout(() => router.push("/dashboard/borrower"), 3000)
    } catch (err) {
      console.error("Error submitting request:", err)
      apiToast(
        "Request Failed",
        "Failed to submit your content request. Please try again.",
        "POST",
        "/request/borrower/new-request",
        "destructive"
      )
      setIsSubmitting(false)
      setSubmitError("An error occurred while submitting your request. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/borrower"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">John Doe</span>
            </div>
            <Link
              href="/auth"
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
            >
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* ─── Your past requests ─────────────────────────────────────────── */}
        <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 mb-8 overflow-x-auto max-h-64">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((r) => {
                const [y, m, d, hh, mm, ss] = r.requestDate
                const date = new Date(y, m - 1, d, hh, mm, ss)
                const statusClass =
                  r.status === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : r.status === "CANCELLED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{r.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.itemType}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.itemName}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{r.itemBy}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {date.toLocaleDateString()}{" "}
                      {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}
                      >
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {submitSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30 text-center">
            <CheckCircle className="h-16 w-16 text-[#39FF14] mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Request Submitted Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your request. Our librarians will review it and notify you when a
              decision has been made. You will be redirected to your dashboard shortly.
            </p>
            <Link
              href="/dashboard/borrower"
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
            >
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <BookPlus className="h-8 w-8 text-[#39FF14]" />
                <h1 className="text-2xl font-bold text-gray-800">Request New Content</h1>
              </div>

              <p className="text-gray-600 mb-6">
                Can't find what you're looking for in our catalog? Submit a request for new content,
                and our librarians will review it. Please provide as much information as possible to
                help us locate the item.
              </p>

              {submitError && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <p className="text-red-700">{submitError}</p>
                </div>
              )}

<form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`w-full h-10 rounded-md border ${errors.title ? "border-red-300 ring-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]`}
                      placeholder="Enter the title of the content"
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                  </div>

                  {/* Author/Creator */}
                  <div className="space-y-2">
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                      Author/Creator <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="author"
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className={`w-full h-10 rounded-md border ${errors.author ? "border-red-300 ring-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]`}
                      placeholder="Enter the author or creator"
                    />
                    {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
                  </div>

                  {/* Rest of your form code (contentType, category, etc.) continues exactly same here... */}
                  {/* Content Type */}
                  <div className="space-y-2">
                    <label htmlFor="contentType" className="block text-sm font-medium text-gray-700">
                      Content Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="contentType"
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    >
                      {contentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className={`w-full h-10 rounded-md border ${errors.category ? "border-red-300 ring-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]`}
                    >
                      <option value="">Select a category</option>
                      {bookCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
                  </div>

                  {/* ISBN (Optional) */}
                  <div className="space-y-2">
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                      ISBN/ISSN (Optional)
                    </label>
                    <input
                      id="isbn"
                      type="text"
                      value={isbn}
                      onChange={(e) => setIsbn(e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      placeholder="Enter ISBN or ISSN if known"
                    />
                    <p className="text-xs text-gray-500">This helps us identify the exact edition you're requesting</p>
                  </div>

                  {/* Publication Year (Optional) */}
                  <div className="space-y-2">
                    <label htmlFor="publicationYear" className="block text-sm font-medium text-gray-700">
                      Publication Year (Optional)
                    </label>
                    <input
                      id="publicationYear"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={publicationYear}
                      onChange={(e) => setPublicationYear(e.target.value)}
                      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      placeholder="Enter publication year if known"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full rounded-md border ${errors.description ? "border-red-300 ring-red-500" : "border-gray-300"} bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]`}
                      rows={3}
                      placeholder="Provide a brief description of the content"
                    />
                    {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
                  </div>

                  {/* Reason for Request (Optional) */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                      Reason for Request (Optional)
                    </label>
                    <textarea
                      id="reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      rows={2}
                      placeholder="Why are you interested in this content?"
                    />
                  </div>

                  {/* Urgency */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Urgency</label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          value="low"
                          checked={urgency === "low"}
                          onChange={() => setUrgency("low")}
                          className="h-4 w-4 text-[#39FF14] focus:ring-[#39FF14] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Low</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          value="normal"
                          checked={urgency === "normal"}
                          onChange={() => setUrgency("normal")}
                          className="h-4 w-4 text-[#39FF14] focus:ring-[#39FF14] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Normal</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="urgency"
                          value="high"
                          checked={urgency === "high"}
                          onChange={() => setUrgency("high")}
                          className="h-4 w-4 text-[#39FF14] focus:ring-[#39FF14] border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">High</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Required Fields Note */}
                <p className="text-sm text-gray-500 mb-6">
                  <span className="text-red-500">*</span> Required fields
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Link
                    href="/dashboard/borrower"
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
