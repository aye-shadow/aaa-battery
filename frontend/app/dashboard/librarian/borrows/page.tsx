"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen, ArrowLeft, User, LogOut, Filter, Search, CheckCircle, XCircle, Clock, Book, Headphones, Disc, FileSearch
} from "lucide-react"
import { requestAPI } from "@/lib/api/request"
import { useToast } from "@/hooks/use-toast"

export default function ContentRequestsManagementPage() {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [isLoading, setIsLoading] = useState(true)
  const [showPopup, setShowPopup] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionReason, setActionReason] = useState("")
  const { apiToast } = useToast()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await requestAPI.getContentRequests()
        apiToast("Data Loaded", "Content requests fetched successfully.", "GET", "/request/librarian/view-requests", "info")
        setRequests(response)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching content requests:", error)
        apiToast("Error", "Failed to fetch content requests.", "GET", "/request/librarian/view-requests", "destructive")
        setIsLoading(false)
      }
    }
    fetchRequests()
  }, [apiToast])

  const handleRowClick = (request) => {
    setSelectedRequest(request)
    setActionReason("")
    setShowPopup(true)
  }

  const handleRequestAction = async (status) => {
    if (!selectedRequest) return
    try {
      await requestAPI.handleContentRequest({
        id: selectedRequest.id,
        status,
        reason: actionReason,
      })
      setShowPopup(false)
      setRequests((prev) => prev.map(r => r.id === selectedRequest.id ? { ...r, status } : r))
      apiToast("Updated", `Request ${status.toLowerCase()} successfully.`, "POST", "/request/librarian/handle-request", "success")
    } catch (err) {
      apiToast("Error", err.message, "POST", "/request/librarian/handle-request", "destructive")
    }
  }

  const filteredRequests = requests
    .filter((request) => {
      const searchLower = searchTerm.toLowerCase()
      return (
        request.itemName.toLowerCase().includes(searchLower) ||
        request.itemBy.toLowerCase().includes(searchLower) ||
        request.requestor?.fullName?.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(dateArrayToString(b.requestDate)).getTime() - new Date(dateArrayToString(a.requestDate)).getTime()
        case "requestor":
          return (a.requestor?.fullName || "").localeCompare(b.requestor?.fullName || "")
        case "title":
          return a.itemName.localeCompare(b.itemName)
        default:
          return 0
      }
    })

  function dateArrayToString(dateArray) {
    if (!dateArray || dateArray.length < 3) return ""
    const [year, month, day] = dateArray
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  function getItemTypeIcon(type) {
    switch (type) {
      case "book": return <Book className="h-5 w-5" />
      case "audiobook": return <Headphones className="h-5 w-5" />
      case "dvd": return <Disc className="h-5 w-5" />
      default: return <Book className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Popup Modal */}
      {showPopup && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg border border-[#39FF14]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Handle Request</h2>
              <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-800">×</button>
            </div>
            <p className="text-sm text-gray-700 mb-2">What action would you like to take for <strong>{selectedRequest.itemName}</strong>?</p>
            <textarea
              className="w-full h-24 p-2 text-sm border border-gray-300 rounded-md focus:ring-[#39FF14] focus:border-[#39FF14] mb-4"
              placeholder="Reason for action..."
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleRequestAction("CANCELLED")}
                className="px-4 py-2 rounded bg-red-100 text-red-700 hover:bg-red-200"
              >
                Cancel Request
              </button>
              <button
                onClick={() => handleRequestAction("APPROVED")}
                className="px-4 py-2 rounded bg-green-100 text-green-800 hover:bg-green-200"
              >
                Approve Request
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/librarian" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">Admin</span>
            </div>
            <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Content Requests</h1>
            <p className="text-gray-600">Manage new content requests from library members</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by requestor, title, or author..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort by: Request Date</option>
                <option value="requestor">Sort by: Requestor Name</option>
                <option value="title">Sort by: Content Title</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading content requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requestor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    onClick={() => handleRowClick(request)}          // <-- click opens modal
                    className="cursor-pointer hover:bg-gray-50/60"  // <-- visual feedback
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {request.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {request.requestor?.fullName || "Unknown User"}
                      <div className="text-xs text-gray-500">
                        {request.requestor?.email || "No email"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 flex items-center gap-2">
                      {getItemTypeIcon(request.itemType)} {request.itemType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {request.itemBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {dateArrayToString(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="h-3 w-3 mr-1" />
                        {request.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FileSearch className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Content Requests Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              There are no content requests matching your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
