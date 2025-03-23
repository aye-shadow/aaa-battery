"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Book,
  Headphones,
  Disc,
  AlertCircle,
  FileText,
  CheckSquare,
  PlusCircle,
  ChevronDown,
  FileSearch,
} from "lucide-react"
import { borrowAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function BorrowsManagementPage() {
  const router = useRouter()
  const [requests, setRequests] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("pending")
  const [sortBy, setSortBy] = useState("date")
  const [processingIds, setProcessingIds] = useState([])
  const [showActionsForId, setShowActionsForId] = useState(null)
  const [selectedRequests, setSelectedRequests] = useState([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { apiToast } = useToast()

  // Fetch borrow requests from API
  useEffect(() => {
    const fetchBorrowRequests = async () => {
      try {
        // Call the API to get borrow requests with status filter
        const response = await borrowAPI.getBorrowRequests({
          status: statusFilter !== "all" ? statusFilter : undefined,
        })

        // Show success toast with API details
        apiToast("Data Loaded", "Borrow requests have been fetched successfully.", "GET", "/api/borrows", "info")

        setRequests(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching borrow requests:", error)

        // Show error toast with API details
        apiToast(
          "Error Loading Data",
          "Failed to fetch borrow requests. Please try again.",
          "GET",
          "/api/borrows",
          "destructive",
        )

        setIsLoading(false)
      }
    }

    fetchBorrowRequests()
  }, [statusFilter, apiToast])

  // Filter and sort requests based on filters and search term
  const filteredRequests = requests
    .filter((request) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase()
      return (
        request.borrower.name.toLowerCase().includes(searchLower) ||
        request.item.title.toLowerCase().includes(searchLower) ||
        request.item.creator.toLowerCase().includes(searchLower)
      )
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (sortBy) {
        case "date":
          return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        case "borrower":
          return a.borrower.name.localeCompare(b.borrower.name)
        case "title":
          return a.item.title.localeCompare(b.item.title)
        case "returnDate":
          return new Date(a.returnDate).getTime() - new Date(b.returnDate).getTime()
        default:
          return 0
      }
    })

  // Handle approving a borrow request
  const handleApprove = async (requestId) => {
    setProcessingIds((prev) => [...prev, requestId])

    try {
      // Call the API to approve the request
      await borrowAPI.approveBorrowRequest(requestId)

      // Show success toast with API details
      apiToast(
        "Request Approved",
        "The borrow request has been approved successfully.",
        "PUT",
        `/api/borrows/${requestId}/approve`,
        "success",
      )

      // Update local state
      setRequests((prev) =>
        prev.map((request) => (request.id === requestId ? { ...request, status: "approved" } : request)),
      )
    } catch (error) {
      console.error("Error approving request:", error)

      // Show error toast with API details
      apiToast(
        "Approval Failed",
        "Failed to approve the borrow request. Please try again.",
        "PUT",
        `/api/borrows/${requestId}/approve`,
        "destructive",
      )
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestId))
      setShowActionsForId(null)
    }
  }

  // Handle declining a borrow request
  const handleDecline = async (requestId) => {
    setProcessingIds((prev) => [...prev, requestId])

    try {
      // Call the API to decline the request
      await borrowAPI.declineBorrowRequest(requestId)

      // Show success toast with API details
      apiToast(
        "Request Declined",
        "The borrow request has been declined.",
        "PUT",
        `/api/borrows/${requestId}/decline`,
        "info",
      )

      // Update local state
      setRequests((prev) =>
        prev.map((request) => (request.id === requestId ? { ...request, status: "declined" } : request)),
      )
    } catch (error) {
      console.error("Error declining request:", error)

      // Show error toast with API details
      apiToast(
        "Decline Failed",
        "Failed to decline the borrow request. Please try again.",
        "PUT",
        `/api/borrows/${requestId}/decline`,
        "destructive",
      )
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== requestId))
      setShowActionsForId(null)
    }
  }

  // Toggle selection of a request for bulk actions
  const toggleRequestSelection = (requestId) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId) ? prev.filter((id) => id !== requestId) : [...prev, requestId],
    )
  }

  // Handle bulk approval of selected requests
  const handleBulkApprove = async () => {
    // Add all selected requests to processing
    setProcessingIds((prev) => [...prev, ...selectedRequests])

    try {
      // Process each selected request sequentially
      for (const requestId of selectedRequests) {
        await borrowAPI.approveBorrowRequest(requestId)
      }

      // Show success toast with API details
      apiToast(
        "Bulk Approval Successful",
        `${selectedRequests.length} requests have been approved.`,
        "PUT",
        "/api/borrows/bulk-approve",
        "success",
      )

      // Update local state
      setRequests((prev) =>
        prev.map((request) => (selectedRequests.includes(request.id) ? { ...request, status: "approved" } : request)),
      )
    } catch (error) {
      console.error("Error in bulk approval:", error)

      // Show error toast with API details
      apiToast(
        "Bulk Approval Failed",
        "Failed to approve some or all of the selected requests.",
        "PUT",
        "/api/borrows/bulk-approve",
        "destructive",
      )
    } finally {
      setProcessingIds([])
      setSelectedRequests([])
      setShowBulkActions(false)
    }
  }

  // Handle bulk decline of selected requests
  const handleBulkDecline = async () => {
    // Add all selected requests to processing
    setProcessingIds((prev) => [...prev, ...selectedRequests])

    try {
      // Process each selected request sequentially
      for (const requestId of selectedRequests) {
        await borrowAPI.declineBorrowRequest(requestId)
      }

      // Show success toast with API details
      apiToast(
        "Bulk Decline Successful",
        `${selectedRequests.length} requests have been declined.`,
        "PUT",
        "/api/borrows/bulk-decline",
        "info",
      )

      // Update local state
      setRequests((prev) =>
        prev.map((request) => (selectedRequests.includes(request.id) ? { ...request, status: "declined" } : request)),
      )
    } catch (error) {
      console.error("Error in bulk decline:", error)

      // Show error toast with API details
      apiToast(
        "Bulk Decline Failed",
        "Failed to decline some or all of the selected requests.",
        "PUT",
        "/api/borrows/bulk-decline",
        "destructive",
      )
    } finally {
      setProcessingIds([])
      setSelectedRequests([])
      setShowBulkActions(false)
    }
  }

  // View borrower details
  const viewBorrowerDetails = (borrowerId) => {
    // In a real app, this would navigate to the borrower's profile page
    apiToast(
      "Viewing Borrower Details",
      `Fetching details for borrower ID: ${borrowerId}`,
      "GET",
      `/api/borrowers/${borrowerId}`,
      "info",
    )
  }

  // View item details
  const viewItemDetails = (itemId, itemType) => {
    // In a real app, this would navigate to the item's details page
    router.push(`/catalog/${itemType}/${itemId}`)
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
            <h1 className="text-2xl font-bold text-gray-800">Borrow Requests</h1>
            <p className="text-gray-600">Manage borrow requests from library members</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex">
              <button
                onClick={() => setShowBulkActions(!showBulkActions)}
                className={`inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 ${selectedRequests.length > 0 ? "border-l-2 border-[#39FF14]" : ""}`}
                disabled={selectedRequests.length === 0}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Bulk Actions {selectedRequests.length > 0 && `(${selectedRequests.length})`}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>

              {showBulkActions && selectedRequests.length > 0 && (
                <div className="absolute mt-10 right-4 bg-white shadow-lg rounded-md border border-gray-200 p-2 z-10">
                  <button
                    onClick={handleBulkApprove}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Approve Selected
                  </button>
                  <button
                    onClick={handleBulkDecline}
                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <XCircle className="h-4 w-4 mr-2 text-red-500" />
                    Decline Selected
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/dashboard/librarian"
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Manual Loan
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by borrower, title, or creator..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileSearch className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by: Request Date</option>
                  <option value="borrower">Sort by: Borrower Name</option>
                  <option value="title">Sort by: Item Title</option>
                  <option value="returnDate">Sort by: Return Date</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading borrow requests...</p>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-[#39FF14] focus:ring-[#39FF14]"
                          checked={
                            selectedRequests.length > 0 &&
                            selectedRequests.length === filteredRequests.filter((r) => r.status === "pending").length
                          }
                          onChange={() => {
                            const pendingRequestIds = filteredRequests
                              .filter((r) => r.status === "pending")
                              .map((r) => r.id)
                            if (selectedRequests.length === pendingRequestIds.length) {
                              setSelectedRequests([])
                            } else {
                              setSelectedRequests(pendingRequestIds)
                            }
                          }}
                        />
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Borrower
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Request Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Borrow Period
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {request.status === "pending" && (
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-[#39FF14] focus:ring-[#39FF14]"
                            checked={selectedRequests.includes(request.id)}
                            onChange={() => toggleRequestSelection(request.id)}
                          />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded"
                              src={request.item.coverUrl || "/placeholder.svg"}
                              alt={request.item.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              {getItemTypeIcon(request.item.type)}
                              <span className="ml-1 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full capitalize">
                                {request.item.type}
                              </span>
                            </div>
                            <div
                              className="text-sm font-medium text-gray-900 cursor-pointer hover:text-[#39FF14]"
                              onClick={() => viewItemDetails(request.item.id, request.item.type)}
                            >
                              {request.item.title}
                            </div>
                            <div className="text-sm text-gray-500">{request.item.creator}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-[#39FF14]"
                          onClick={() => viewBorrowerDetails(request.borrower.id)}
                        >
                          {request.borrower.name}
                        </div>
                        <div className="text-xs text-gray-500">{request.borrower.email}</div>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                            {request.borrower.borrowCount} items
                          </span>
                          {request.borrower.hasOverdue && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Overdue items
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(request.requestDate)}</div>
                        {request.notes && (
                          <div className="text-xs text-gray-500 max-w-xs truncate" title={request.notes}>
                            <span className="font-medium">Note:</span> {request.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(request.borrowDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-900">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(request.returnDate).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil(
                            (new Date(request.returnDate).getTime() - new Date(request.borrowDate).getTime()) /
                              (1000 * 60 * 60 * 24),
                          )}{" "}
                          days
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "declined"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {request.status === "approved" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" /> Approved
                            </>
                          ) : request.status === "declined" ? (
                            <>
                              <XCircle className="h-3 w-3 mr-1" /> Declined
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" /> Pending
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {request.status === "pending" ? (
                          <div className="relative">
                            <button
                              onClick={() => setShowActionsForId(showActionsForId === request.id ? null : request.id)}
                              className="text-gray-600 hover:text-gray-900 mr-2"
                            >
                              <FileText className="h-5 w-5" />
                            </button>
                            {showActionsForId === request.id && (
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                                <div className="py-1">
                                  <button
                                    onClick={() => handleApprove(request.id)}
                                    disabled={processingIds.includes(request.id)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    {processingIds.includes(request.id) ? (
                                      <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                        Approve Request
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => handleDecline(request.id)}
                                    disabled={processingIds.includes(request.id)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    {processingIds.includes(request.id) ? (
                                      <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                                        Processing...
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                        Decline Request
                                      </>
                                    )}
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  <button
                                    onClick={() => viewBorrowerDetails(request.borrower.id)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <User className="h-4 w-4 mr-2 text-gray-500" />
                                    View Borrower
                                  </button>
                                  <button
                                    onClick={() => viewItemDetails(request.item.id, request.item.type)}
                                    className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    <Book className="h-4 w-4 mr-2 text-gray-500" />
                                    View Item
                                  </button>
                                </div>
                              </div>
                            )}
                            <button
                              onClick={() => handleApprove(request.id)}
                              disabled={processingIds.includes(request.id)}
                              className="text-green-600 hover:text-green-900 mr-2"
                            >
                              {processingIds.includes(request.id) ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                              ) : (
                                <CheckCircle className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDecline(request.id)}
                              disabled={processingIds.includes(request.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              {processingIds.includes(request.id) ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <div>
                            <button
                              onClick={() => viewItemDetails(request.item.id, request.item.type)}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <Book className="h-5 w-5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <FileSearch className="h-8 w-8 text-gray-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No Requests Found</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              {statusFilter === "all" && searchTerm
                ? "No requests match your search criteria. Try adjusting your filters."
                : statusFilter === "pending"
                  ? "There are no pending borrow requests at this time."
                  : statusFilter === "approved"
                    ? "There are no approved borrow requests matching your criteria."
                    : statusFilter === "declined"
                      ? "There are no declined borrow requests matching your criteria."
                      : "There are no borrow requests in the system."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

