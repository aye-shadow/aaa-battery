"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  BookOpen,
  ArrowLeft,
  User,
  LogOut,
  Search,
  Filter,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  FileText,
  History,
  DollarSign,
  Edit,
  FileSearch,
} from "lucide-react"
import { finesAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function FinesManagementPage() {
  const [fines, setFines] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("daysLate-desc")
  const [processingIds, setProcessingIds] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { apiToast } = useToast()

  // Fetch fines from API
  useEffect(() => {
    const fetchFines = async () => {
      try {
        // Prepare filter parameters
        const params: any = {}

        if (statusFilter !== "all") {
          params.status = statusFilter
        }

        // Call the API to get fines
        const response = await finesAPI.getAllFines(params)

        // Show success toast with API details
        apiToast("Data Loaded", "Fines have been fetched successfully.", "GET", "/api/fines", "info")

        setFines(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching fines:", error)

        // Show error toast with API details
        apiToast("Error Loading Data", "Failed to fetch fines. Please try again.", "GET", "/api/fines", "destructive")

        setIsLoading(false)
      }
    }

    fetchFines()
  }, [statusFilter, apiToast])

  // Calculate total amount of unpaid fines
  const totalUnpaidAmount = fines
    .filter((fine) => fine.status === "unpaid" || fine.status === "overdue")
    .reduce((total, fine) => total + fine.amount, 0)

  // Calculate total amount of paid fines
  const totalPaidAmount = fines.filter((fine) => fine.status === "paid").reduce((total, fine) => total + fine.amount, 0)

  // Filter and sort fines
  const filteredFines = fines
    .filter((fine) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        fine.borrower.name.toLowerCase().includes(searchLower) ||
        fine.borrower.email.toLowerCase().includes(searchLower) ||
        fine.item.title.toLowerCase().includes(searchLower) ||
        fine.item.creator.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "unpaid" && fine.status !== "unpaid" && fine.status !== "overdue") {
          return false
        } else if (statusFilter === "paid" && fine.status !== "paid") {
          return false
        } else if (statusFilter === "current" && fine.status !== "current") {
          return false
        }
      }

      return true
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (sortBy) {
        case "daysLate-desc":
          return b.daysLate - a.daysLate
        case "daysLate-asc":
          return a.daysLate - b.daysLate
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        case "dueDate-desc":
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        case "dueDate-asc":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "borrower":
          return a.borrower.name.localeCompare(b.borrower.name)
        default:
          return 0
      }
    })

  // Handle marking a fine as paid
  const handleMarkAsPaid = async (fineId) => {
    setProcessingIds((prev) => [...prev, fineId])

    try {
      // Call the API to mark fine as paid
      const paymentData = {
        method: "Cash",
        amount: fines.find((fine) => fine.id === fineId).amount,
      }

      await finesAPI.payFine(fineId, paymentData)

      // Show success toast with API details
      apiToast(
        "Fine Paid",
        "The fine has been marked as paid successfully.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "success",
      )

      // Update local state
      setFines((prev) =>
        prev.map((fine) =>
          fine.id === fineId
            ? {
                ...fine,
                status: "paid",
                paidDate: new Date().toISOString().split("T")[0],
                paymentMethod: "Cash",
                transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
              }
            : fine,
        ),
      )
    } catch (error) {
      console.error("Error marking fine as paid:", error)

      // Show error toast with API details
      apiToast(
        "Payment Failed",
        "Failed to mark the fine as paid. Please try again.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "destructive",
      )
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== fineId))
    }
  }

  // Handle waiving a fine
  const handleWaiveFine = async (fineId) => {
    setProcessingIds((prev) => [...prev, fineId])

    try {
      // Call the API to waive fine
      await finesAPI.waiveFine(fineId, "Administrative decision")

      // Show success toast with API details
      apiToast("Fine Waived", "The fine has been waived successfully.", "PUT", `/api/fines/${fineId}/waive`, "info")

      // Update local state
      setFines((prev) =>
        prev.map((fine) =>
          fine.id === fineId
            ? {
                ...fine,
                status: "paid",
                paidDate: new Date().toISOString().split("T")[0],
                paymentMethod: "Waived",
                transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
              }
            : fine,
        ),
      )
    } catch (error) {
      console.error("Error waiving fine:", error)

      // Show error toast with API details
      apiToast(
        "Waive Failed",
        "Failed to waive the fine. Please try again.",
        "PUT",
        `/api/fines/${fineId}/waive`,
        "destructive",
      )
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== fineId))
    }
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not returned"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
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
            <h1 className="text-2xl font-bold text-gray-800">Fine Management</h1>
            <p className="text-gray-600">Manage and process library fines</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/librarian/fines/history"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <History className="h-4 w-4 mr-2" />
              View Payment History
            </Link>

            <button
              onClick={() => {
                apiToast("Editing Fine Rates", "Opening fine rate configuration.", "GET", "/api/fines/rates", "info")
              }}
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Fine Rates
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Total Fines</h2>
              <FileText className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{fines.length}</p>
            <p className="text-gray-600 mt-1">All fine records</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Unpaid Fines</h2>
              <AlertCircle className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{formatCurrency(totalUnpaidAmount)}</p>
            <p className="text-gray-600 mt-1">Outstanding balance</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Collected Fines</h2>
              <CheckCircle className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{formatCurrency(totalPaidAmount)}</p>
            <p className="text-gray-600 mt-1">Total collected</p>
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
                placeholder="Search by borrower or item..."
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
                  <option value="unpaid">Unpaid & Overdue</option>
                  <option value="paid">Paid</option>
                  <option value="current">Current Loans</option>
                </select>
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
                  <option value="daysLate-desc">Sort by: Days Late (Highest)</option>
                  <option value="daysLate-asc">Sort by: Days Late (Lowest)</option>
                  <option value="amount-desc">Sort by: Amount (Highest)</option>
                  <option value="amount-asc">Sort by: Amount (Lowest)</option>
                  <option value="dueDate-desc">Sort by: Due Date (Newest)</option>
                  <option value="dueDate-asc">Sort by: Due Date (Oldest)</option>
                  <option value="borrower">Sort by: Borrower Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading fines...</p>
          </div>
        ) : /* Fines Table */
        filteredFines.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
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
                      Due Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Return Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Days Late
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Amount
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
                  {filteredFines.map((fine) => (
                    <tr key={fine.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img
                              className="h-10 w-10 rounded"
                              src={fine.item.coverUrl || "/placeholder.svg"}
                              alt={fine.item.title}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{fine.item.title}</div>
                            <div className="text-sm text-gray-500">{fine.item.creator}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{fine.borrower.name}</div>
                        <div className="text-xs text-gray-500">{fine.borrower.email}</div>
                        {fine.borrower.hasOverdue && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Has overdue items
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(fine.dueDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDate(fine.returnDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {fine.daysLate > 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <Clock className="h-3 w-3 mr-1" />
                            {fine.daysLate} {fine.daysLate === 1 ? "day" : "days"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            On time
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(fine.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            fine.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : fine.status === "unpaid"
                                ? "bg-yellow-100 text-yellow-800"
                                : fine.status === "overdue"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {fine.status === "paid" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </>
                          ) : fine.status === "unpaid" ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unpaid
                            </>
                          ) : fine.status === "overdue" ? (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Overdue
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Current
                            </>
                          )}
                        </span>
                        {fine.status === "paid" && fine.paymentMethod && (
                          <div className="text-xs text-gray-500 mt-1">Via: {fine.paymentMethod}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {(fine.status === "unpaid" || fine.status === "overdue") && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleMarkAsPaid(fine.id)}
                              disabled={processingIds.includes(fine.id)}
                              className="text-[#39FF14] hover:text-[#39FF14]/80"
                              title="Mark as Paid"
                            >
                              {processingIds.includes(fine.id) ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#39FF14] border-t-transparent"></div>
                              ) : (
                                <DollarSign className="h-5 w-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleWaiveFine(fine.id)}
                              disabled={processingIds.includes(fine.id)}
                              className="text-blue-500 hover:text-blue-600"
                              title="Waive Fine"
                            >
                              {processingIds.includes(fine.id) ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                              ) : (
                                <XCircle className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        )}
                        {fine.status === "paid" && <span className="text-gray-500">{formatDate(fine.paidDate)}</span>}
                        {fine.status === "current" && <span className="text-gray-500">No action needed</span>}
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Fines Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No fines match your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
