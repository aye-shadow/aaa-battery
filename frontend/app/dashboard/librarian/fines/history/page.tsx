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
  Download,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  FileSearch,
  DollarSign,
} from "lucide-react"
import { finesAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function FineHistoryLogPage() {
  const [paymentHistory, setPaymentHistory] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date-desc")
  const [isLoading, setIsLoading] = useState(true)
  const { apiToast } = useToast()

  // Fetch payment history from API
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        // Prepare filter parameters
        const params: any = {}

        if (dateFilter !== "all") {
          params.period = dateFilter
        }

        if (methodFilter !== "all") {
          params.method = methodFilter
        }

        // Call the API to get payment history
        const response = await finesAPI.getPaymentHistory(params)

        // Show success toast with API details
        apiToast("Data Loaded", "Payment history has been fetched successfully.", "GET", "/api/fines/payments", "info")

        setPaymentHistory(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching payment history:", error)

        // Show error toast with API details
        apiToast(
          "Error Loading Data",
          "Failed to fetch payment history. Please try again.",
          "GET",
          "/api/fines/payments",
          "destructive",
        )

        setIsLoading(false)
      }
    }

    fetchPaymentHistory()
  }, [dateFilter, methodFilter, apiToast])

  // Calculate total amount collected
  const totalCollected = paymentHistory
    .filter((payment) => payment.status === "completed")
    .reduce((total, payment) => total + payment.amount, 0)

  // Calculate total amount waived
  const totalWaived = paymentHistory
    .filter((payment) => payment.status === "waived")
    .reduce((total, payment) => total + payment.amount, 0)

  // Filter and sort payment history
  const filteredHistory = paymentHistory
    .filter((payment) => {
      // Search term filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        payment.borrower.name.toLowerCase().includes(searchLower) ||
        payment.borrower.email.toLowerCase().includes(searchLower) ||
        payment.id.toLowerCase().includes(searchLower) ||
        payment.transactionId.toLowerCase().includes(searchLower) ||
        payment.items.some(
          (item) => item.title.toLowerCase().includes(searchLower) || item.creator.toLowerCase().includes(searchLower),
        )

      return matchesSearch
    })
    .sort((a, b) => {
      // Sort based on selected sort option
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        case "borrower":
          return a.borrower.name.localeCompare(b.borrower.name)
        default:
          return 0
      }
    })

  // Handle export to CSV
  const exportToCSV = () => {
    // Show API toast for the export operation
    apiToast("Exporting Data", "Generating CSV file for download.", "GET", "/api/fines/payments/export", "info")

    // In a real app, this would generate and download a CSV file
    console.log("Exporting payment history to CSV...")

    // Example implementation:
    const headers = [
      "Payment ID",
      "Date",
      "Time",
      "Borrower",
      "Items",
      "Amount",
      "Method",
      "Status",
      "Transaction ID",
      "Processed By",
    ]
    const rows = filteredHistory.map((payment) => [
      payment.id,
      formatDate(payment.date),
      formatTime(payment.date),
      payment.borrower.name,
      payment.items.map((item) => item.title).join(", "),
      formatCurrency(payment.amount),
      payment.method,
      payment.status,
      payment.transactionId,
      payment.processedBy,
    ])

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `fine_payment_history_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Show success toast after export
    apiToast(
      "Export Successful",
      "Payment history has been exported to CSV.",
      "GET",
      "/api/fines/payments/export",
      "success",
    )
  }

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to format time
  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
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
            <h1 className="text-2xl font-bold text-gray-800">Fine Payment History</h1>
            <p className="text-gray-600">View all fine payments made by library members</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/librarian/fines"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Manage Fines
            </Link>

            <button
              onClick={exportToCSV}
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to CSV
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Total Payments</h2>
              <FileText className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{paymentHistory.length}</p>
            <p className="text-gray-600 mt-1">All-time payment records</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Total Collected</h2>
              <CreditCard className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{formatCurrency(totalCollected)}</p>
            <p className="text-gray-600 mt-1">From completed payments</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">Total Waived</h2>
              <CheckCircle className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">{formatCurrency(totalWaived)}</p>
            <p className="text-gray-600 mt-1">From waived fines</p>
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
                placeholder="Search by borrower, transaction ID, or item..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                >
                  <option value="all">All Payment Methods</option>
                  <option value="credit card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="waived">Waived</option>
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
                  <option value="date-desc">Sort by: Date (Newest)</option>
                  <option value="date-asc">Sort by: Date (Oldest)</option>
                  <option value="amount-desc">Sort by: Amount (Highest)</option>
                  <option value="amount-asc">Sort by: Amount (Lowest)</option>
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
            <p className="mt-4 text-gray-600">Loading payment history...</p>
          </div>
        ) : /* Payment History Table */
        filteredHistory.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date & Time
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
                      Items
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
                      Method
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
                      Processed By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-gray-900">
                            <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                            {formatDate(payment.date)}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="h-3 w-3 text-gray-400 mr-1" />
                            {formatTime(payment.date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.borrower.name}</div>
                        <div className="text-xs text-gray-500">{payment.borrower.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {payment.items.map((item, index) => (
                            <div key={index} className="mb-1 last:mb-0">
                              {item.title} <span className="text-xs text-gray-500">({item.type})</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          {payment.method === "Credit Card" ? (
                            <>
                              <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                              {payment.method} {payment.cardLast4 && `(**** ${payment.cardLast4})`}
                            </>
                          ) : payment.method === "Cash" ? (
                            <>
                              <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                              {payment.method}
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-gray-400 mr-1" />
                              {payment.method}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "waived"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {payment.status === "completed" ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completed
                            </>
                          ) : payment.status === "waived" ? (
                            <>
                              <XCircle className="h-3 w-3 mr-1" />
                              Waived
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              {payment.status}
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.processedBy}</td>
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
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Payment Records Found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No payment records match your search criteria. Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
