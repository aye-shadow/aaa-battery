"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Check, User, LogOut } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { borrowAPI } from "@/lib/api"

export default function BorrowerReturnsPage() {
  const { toast } = useToast()
  const [borrowedItems, setBorrowedItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [returningItems, setReturningItems] = useState<number[]>([])
  const [returnedItems, setReturnedItems] = useState<number[]>([])

  // Fetch borrowed items when component mounts
  useEffect(() => {
    const fetchBorrowedItems = async () => {
      setIsLoading(true)

      // Show API notification for GET request
      toast({
        title: "API Request",
        description: "GET /api/borrows/user - Fetching borrowed items...",
        variant: "default",
      })

      try {
        // Use the borrowAPI to get borrowed items
        const response = await borrowAPI.getBorrowedItems(101) // Assuming user ID 101

        // Update state with the fetched data
        setBorrowedItems(response.data)

        // Show success notification
        toast({
          title: "API Success",
          description: `Loaded ${response.data.length} borrowed items`,
          variant: "success",
        })
      } catch (error) {
        console.error("Error fetching borrowed items:", error)

        // Show error notification
        toast({
          title: "API Error",
          description: `Failed to fetch borrowed items: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBorrowedItems()
  }, [toast])

  // Handle returning an item
  const handleReturnItem = async (itemId: number) => {
    // Add item to returning state to show loading
    setReturningItems((prev) => [...prev, itemId])

    // Show API notification for POST request
    toast({
      title: "API Request",
      description: `POST /api/borrows/${itemId}/return - Returning item...`,
      variant: "default",
    })

    try {
      // Use the borrowAPI to return the item
      await borrowAPI.returnItem(itemId)

      // Add item to returned state
      setReturnedItems((prev) => [...prev, itemId])

      // Show success notification
      toast({
        title: "API Success",
        description: "Item returned successfully",
        variant: "success",
      })

      // If all items are returned, show a final success message
      if (returnedItems.length + 1 === borrowedItems.length) {
        toast({
          title: "All Items Returned",
          description: "Thank you for returning all your borrowed items.",
          variant: "success",
        })
      }
    } catch (error) {
      console.error("Error returning item:", error)

      // Show error notification
      toast({
        title: "API Error",
        description: `Failed to return item: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      // Remove item from returning state
      setReturningItems((prev) => prev.filter((id) => id !== itemId))
    }
  }

  // Filter out already returned items
  const activeItems = borrowedItems.filter((item: any) => !returnedItems.includes(item.id))

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
            <Link href="/dashboard/borrower" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Return Items</h1>
          <p className="text-gray-600 mt-2">Return your borrowed items to the library.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
          </div>
        ) : activeItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <Check className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">All Items Returned</h2>
              <p className="text-gray-600 mb-6">You have no items to return at this time.</p>
              <Link
                href="/dashboard/borrower"
                className="inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {activeItems.map((item: any) => (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm">
                <div className="p-4 flex items-center gap-4">
                  <img
                    src={item.item.coverUrl || "/placeholder.svg?height=60&width=40"}
                    alt={`Cover of ${item.item.title}`}
                    className="h-20 w-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.item.type === "book" || item.item.type === "audiobook" ? "Author" : "Director"}:{" "}
                      {item.item.creator}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                        {item.item.type}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Borrowed: {new Date(item.borrowDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          new Date(item.dueDate) < new Date()
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        Due: {new Date(item.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleReturnItem(item.id)}
                    disabled={returningItems.includes(item.id)}
                    className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {returningItems.includes(item.id) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                        Returning...
                      </>
                    ) : (
                      "Return Item"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

