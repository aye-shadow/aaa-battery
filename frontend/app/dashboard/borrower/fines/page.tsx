// app/dashboard/borrower/fines/page.tsx
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
  CreditCard,
  FileText,
  History,
  DollarSign,
  FileSearch,
} from "lucide-react"
import { finesAPI } from "@/lib/api/fines"
import { useToast } from "@/hooks/use-toast"

export default function BorrowerFinesPage() {
  const [fines, setFines] = useState<any[]>([])
  const [paymentHistory, setPaymentHistory] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"outstanding" | "history">("outstanding")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("dueDate-desc")
  const [processingIds, setProcessingIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { apiToast } = useToast()

  // ─── Outstanding fines: use new /fines/borrower/my-fines endpoint ───────────
  useEffect(() => {
    const fetchFines = async () => {
      try {
        apiToast(
          "Loading Fines",
          "Fetching your outstanding fines…",
          "GET",
          `/api/fines/borrower/my-fines`,
          "info"
        )
        const data = await finesAPI.getMyFines()
        apiToast(
          "Data Loaded",
          "Your fines have been fetched successfully.",
          "GET",
          `/api/fines/borrower/my-fines`,
          "info"
        )
        setFines(data)
      } catch (error) {
        console.error("Error fetching fines:", error)
        apiToast(
          "Error Loading Data",
          "Failed to fetch your fines. Please try again.",
          "GET",
          `/api/fines/borrower/my-fines`,
          "destructive"
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (activeTab === "outstanding") {
      setIsLoading(true)
      fetchFines()
    }
  }, [activeTab, apiToast])

  // ─── Payment history (unchanged) ──────────────────────────────────────────
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        apiToast(
          "Loading History",
          "Fetching your payment history…",
          "GET",
          `/api/fines/payments?userId=…`,
          "info"
        )
        const resp = await finesAPI.getPaymentHistory({ userId: 101 })
        apiToast(
          "Data Loaded",
          "Your payment history has been fetched successfully.",
          "GET",
          `/api/fines/payments?userId=…`,
          "info"
        )
        setPaymentHistory(resp.data)
      } catch (error) {
        console.error("Error fetching payment history:", error)
        apiToast(
          "Error Loading Data",
          "Failed to fetch your payment history. Please try again.",
          "GET",
          `/api/fines/payments?userId=…`,
          "destructive"
        )
      } finally {
        setIsLoading(false)
      }
    }

    if (activeTab === "history") {
      setIsLoading(true)
      fetchPaymentHistory()
    }
  }, [activeTab, apiToast])

  // ─── Compute total of unpaid fines ─────────────────────────────────────────
  const totalUnpaidAmount = fines
    .filter((f) => !f.paid)
    .reduce((sum, f) => sum + f.amount, 0)

  // ─── Filter & sort outstanding fines ──────────────────────────────────────
  const filteredFines = fines
    .filter((fine) => {
      const term = searchTerm.toLowerCase()
      return (
        fine.itemName.toLowerCase().includes(term) ||
        // if you had a creator field:
        // fine.creator?.toLowerCase().includes(term)
        false
      )
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "dueDate-desc":
          return b.returnDate - a.returnDate
        case "dueDate-asc":
          return a.returnDate - b.returnDate
        case "amount-desc":
          return b.amount - a.amount
        case "amount-asc":
          return a.amount - b.amount
        case "title":
          return a.itemName.localeCompare(b.itemName)
        default:
          return 0
      }
    })

  // ─── Filter & sort payment history (unchanged) ────────────────────────────
  const filteredHistory = paymentHistory
    .filter((payment) => {
      const term = searchTerm.toLowerCase()
      return (
        payment.transactionId.toLowerCase().includes(term) ||
        payment.items?.some((i: any) => i.title.toLowerCase().includes(term))
      )
    })
    .sort((a, b) => b.date - a.date)

  // ─── Payment handler (unchanged) ─────────────────────────────────────────
  const handlePayFine = async (fineId: number) => {
    setProcessingIds((p) => [...p, fineId])
    try {
      const f = fines.find((x) => x.fineId === fineId)!
      const paymentData = {
        method: "Credit Card",
        cardNumber: "4242424242424242",
        cardExpiry: "12/25",
        cardCvc: "123",
        amount: f.amount,
      }
      apiToast(
        "Processing Payment",
        "Your payment is being processed…",
        "POST",
        `/api/fines/${fineId}/pay`,
        "info"
      )
      await finesAPI.payFine(fineId, paymentData)
      apiToast(
        "Payment Successful",
        "Your fine has been paid successfully.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "success"
      )
      setFines((prev) =>
        prev.map((x) =>
          x.fineId === fineId ? { ...x, paid: true, paidDate: Date.now() } : x
        )
      )
    } catch (error) {
      console.error("Error paying fine:", error)
      apiToast(
        "Payment Failed",
        "Failed to process your payment. Please try again.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "destructive"
      )
    } finally {
      setProcessingIds((p) => p.filter((id) => id !== fineId))
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const formatDate = (ms: number) =>
    new Date(ms).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  const formatTime = (ms: number) =>
    new Date(ms).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amt)

  // ─── Render ──────────────────────────────────────────────────────────────
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
        {/* Tabs */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Fines</h1>
            <p className="text-gray-600">Manage and pay your library fines</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab("outstanding")}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors ${
                activeTab === "outstanding"
                  ? "bg-[#39FF14] text-black"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Outstanding Fines
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium shadow transition-colors ${
                activeTab === "history"
                  ? "bg-[#39FF14] text-black"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <History className="h-4 w-4 mr-2" />
              Payment History
            </button>
          </div>
        </div>

        {activeTab === "outstanding" && (
          <>
            {/* Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Total Outstanding</h2>
                <AlertCircle className="h-5 w-5 text-[#39FF14]" />
              </div>
              <p className="text-3xl font-bold text-[#39FF14]">
                {formatCurrency(totalUnpaidAmount)}
              </p>
              <p className="text-gray-600 mt-1">
                {fines.filter((f) => !f.paid).length} unpaid fines
              </p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by item name…"
                    className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
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
                    <option value="dueDate-desc">Due Date (Newest)</option>
                    <option value="dueDate-asc">Due Date (Oldest)</option>
                    <option value="amount-desc">Amount (Highest)</option>
                    <option value="amount-asc">Amount (Lowest)</option>
                    <option value="title">Item Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table or Loading */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your fines...</p>
              </div>
            ) : filteredFines.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Return Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Days Late
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredFines.map((fine) => (
                      <tr key={fine.fineId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded"
                                src="/placeholder.svg?height=60&width=40"
                                alt={fine.itemName}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {fine.itemName}
                              </div>
                            </div>
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
                              {fine.daysLate}{" "}
                              {fine.daysLate === 1 ? "day" : "days"}
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
                              fine.paid
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {fine.paid ? (
                              <>
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Paid
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3 w-3 mr-1" />
                                Unpaid
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {!fine.paid && (
                            <button
                              onClick={() => handlePayFine(fine.fineId)}
                              disabled={processingIds.includes(fine.fineId)}
                              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-3 py-1.5 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90 disabled:opacity-50"
                            >
                              {processingIds.includes(fine.fineId) ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                              ) : (
                                <>
                                  <CreditCard className="h-4 w-4 mr-1" />
                                  Pay Now
                                </>
                              )}
                            </button>
                          )}
                          {fine.paid && (
                            <span className="text-green-600 flex items-center">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Paid on {formatDate(fine.paidDate!)}
                            </span>
                          )}
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Fines Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You don’t have any outstanding fines at the moment.
                </p>
              </div>
            )}
          </>
        )}

        {/* ─── Payment History Tab ───────────────────────────────────────── */}
        {activeTab === "history" && (
          <>
            <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6 mb-6">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Payment History
                </h2>
                <FileText className="h-5 w-5 text-[#39FF14]" />
              </div>
              <p className="text-3xl font-bold text-[#39FF14]">
                {paymentHistory.length}
              </p>
              <p className="text-gray-600 mt-1">Total payments made</p>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by item title or transaction ID..."
                  className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent"></div>
                <p className="mt-4 text-gray-600">
                  Loading your payment history...
                </p>
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHistory.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
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
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {payment.items.map((item: any, i: number) => (
                              <div key={i} className="mb-1 last:mb-0">
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
                                {payment.method} (**** {payment.cardLast4})
                              </>
                            ) : payment.method === "Cash" ? (
                              <>
                                <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                                {payment.method}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 text-gray-400 mr-1" />
                                {payment.method}
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="font-mono">{payment.transactionId}</span>
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
                                <CheckCircle className="h-3 w-3 mr-1" />
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
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  No Payment History Found
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You haven’t made any fine payments yet. Your payment history will
                  appear here once you’ve paid a fine.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
