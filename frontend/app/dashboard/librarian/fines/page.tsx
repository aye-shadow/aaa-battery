// app/dashboard/librarian/fines/page.tsx

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
  FileText,
  History,
  DollarSign,
  Edit,
  XCircle,
  AlertCircle,
  CheckCircle,
  FileSearch
} from "lucide-react"
import { finesAPI } from "@/lib/api/fines"
import { useToast } from "@/hooks/use-toast"

export default function FinesManagementPage() {
  const [fines, setFines] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all"|"paid"|"unpaid">("all")
  const [processingIds, setProcessingIds] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { apiToast } = useToast()

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const data = await finesAPI.getAllFines()
        apiToast(
          "Data Loaded",
          "Fines have been fetched successfully.",
          "GET",
          "/api/fines/librarian/view-fines",
          "info"
        )
        setFines(data || [])
      } catch (err) {
        console.error(err)
        apiToast(
          "Error Loading Data",
          "Failed to fetch fines. Please try again.",
          "GET",
          "/api/fines/librarian/view-fines",
          "destructive"
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchFines()
  }, [apiToast])

  // compute totals
  const totalUnpaid = fines
    .filter((f) => !f.paid)
    .reduce((sum, f) => sum + f.amount, 0)
  const totalPaid = fines
    .filter((f) => f.paid)
    .reduce((sum, f) => sum + f.amount, 0)

  const handleMarkAsPaid = async (fineId: number) => {
    setProcessingIds((ids) => [...ids, fineId])
    try {
      await finesAPI.payFine(fineId, {
        method: "Cash",
        amount: fines.find((f) => f.fineId === fineId)!.amount,
      })
      apiToast(
        "Fine Paid",
        "The fine has been marked as paid successfully.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "success"
      )
      setFines((prev) =>
        prev.map((f) => (f.fineId === fineId ? { ...f, paid: true } : f))
      )
    } catch {
      apiToast(
        "Payment Failed",
        "Failed to mark the fine as paid. Please try again.",
        "POST",
        `/api/fines/${fineId}/pay`,
        "destructive"
      )
    } finally {
      setProcessingIds((ids) => ids.filter((id) => id !== fineId))
    }
  }

  const handleWaiveFine = async (fineId: number) => {
    setProcessingIds((ids) => [...ids, fineId])
    try {
      await finesAPI.waiveFine(fineId, "Administrative decision")
      apiToast(
        "Fine Waived",
        "The fine has been waived successfully.",
        "PUT",
        `/api/fines/${fineId}/waive`,
        "info"
      )
      setFines((prev) =>
        prev.map((f) => (f.fineId === fineId ? { ...f, paid: true } : f))
      )
    } catch {
      apiToast(
        "Waive Failed",
        "Failed to waive the fine. Please try again.",
        "PUT",
        `/api/fines/${fineId}/waive`,
        "destructive"
      )
    } finally {
      setProcessingIds((ids) => ids.filter((id) => id !== fineId))
    }
  }

  const formatCurrency = (amt: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amt)

  // Filter + search
  const filtered = fines.filter((f) => {
    if (statusFilter === "paid" && !f.paid) return false
    if (statusFilter === "unpaid" && f.paid) return false
    const q = searchTerm.toLowerCase()
    return (
      f.borrowerName.toLowerCase().includes(q) ||
      f.itemName.toLowerCase().includes(q)
    )
  })

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
            <Link
              href="/dashboard/librarian"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">Admin</span>
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
        {/* TITLE & ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Fine Management
            </h1>
            <p className="text-gray-600">Manage and process library fines</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/dashboard/librarian/fines/history"
              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-200"
            >
              <History className="h-4 w-4 mr-2" /> View Payment History
            </Link>
            <button
              onClick={() =>
                apiToast(
                  "Editing Fine Rates",
                  "Opening fine rate configuration.",
                  "GET",
                  "/api/fines/rates",
                  "info"
                )
              }
              className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90"
            >
              <Edit className="h-4 w-4 mr-2" /> Edit Fine Rates
            </button>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Unpaid
              </h2>
              <AlertCircle className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">
              {formatCurrency(totalUnpaid)}
            </p>
            <p className="text-gray-600 mt-1">Outstanding balance</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-800">
                Total Collected
              </h2>
              <CheckCircle className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-3xl font-bold text-[#39FF14]">
              {formatCurrency(totalPaid)}
            </p>
            <p className="text-gray-600 mt-1">Amount paid</p>
          </div>
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute inset-y-0 left-0 pl-3 h-5 w-5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by borrower or item..."
                className="pl-10 w-full h-10 rounded-md border border-gray-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "paid", "unpaid"] as const).map((sf) => (
                <button
                  key={sf}
                  onClick={() => setStatusFilter(sf)}
                  className={`px-4 py-2 rounded ${
                    statusFilter === sf
                      ? "bg-[#39FF14] text-black"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {sf.charAt(0).toUpperCase() + sf.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE OR STATE */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#39FF14] border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Loading fines...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["Item", "Borrower", "Amount", "Status", "Action"].map(
                    (th) => (
                      <th
                        key={th}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {th}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filtered.map((fine) => (
                  <tr key={fine.fineId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fine.itemName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {fine.borrowerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(fine.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {fine.paid ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Unpaid
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      {!fine.paid && (
                        <>
                          <button
                            onClick={() => handleMarkAsPaid(fine.fineId)}
                            disabled={processingIds.includes(fine.fineId)}
                            className="text-[#39FF14] hover:text-[#39FF14]/80"
                          >
                            <DollarSign className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleWaiveFine(fine.fineId)}
                            disabled={processingIds.includes(fine.fineId)}
                            className="text-blue-500 hover:text-blue-600"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-[#39FF14]/30 p-8 text-center">
            <FileSearch className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Fines Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
