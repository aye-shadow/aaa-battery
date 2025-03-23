"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Search, Filter, Book, ArrowLeft, Plus, Edit, User, LogOut, Disc, Headphones } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { catalogAPI } from "@/lib/api"

// Helper function to get the appropriate icon for each item type
const getItemTypeIcon = (type: string) => {
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
const getCreatorLabel = (type: string) => {
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

export default function CatalogPage() {
  // First, let's modify how we determine and store the user role
  // Add this near the top of the component, replacing the existing userRole state

  // Instead of just using a state that defaults to "borrower", let's check localStorage
  const [userRole, setUserRole] = useState(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // Try to get the role from localStorage
      const savedRole = localStorage.getItem("userRole")
      // Return the saved role or default to "borrower"
      return savedRole || "librarian"
    }
    // Default for server-side rendering
    return "librarian"
  })

  // Add this effect to persist the role when it changes
  useEffect(() => {
    // Save the role to localStorage whenever it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", userRole)
    }
  }, [userRole])

  // Add this to help with debugging
  useEffect(() => {
    console.log("Current user role:", userRole)
  }, [userRole])

  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("All")
  const [selectedItemType, setSelectedItemType] = useState("All")
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  // const [userRole, setUserRole] = useState("borrower") // Toggle between "borrower" and "librarian" to test
  const [viewMode, setViewMode] = useState("grid") // "grid" or "list"
  const [libraryItems, setLibraryItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [genres, setGenres] = useState(["All"])
  const [itemTypes, setItemTypes] = useState(["All"])

  // Fetch catalog data when component mounts or filters change
  useEffect(() => {
    const fetchCatalogData = async () => {
      setIsLoading(true)

      // Show API notification for GET request
      toast({
        title: "API Request",
        description: "GET /api/catalog - Fetching catalog items...",
        variant: "default",
      })

      try {
        // Build filters object based on current selections
        const filters: any = {}
        if (selectedItemType !== "All") filters.type = selectedItemType
        if (selectedGenre !== "All") filters.genre = selectedGenre
        if (availabilityFilter !== "all") {
          filters.available = availabilityFilter === "available"
        }

        // Call the API function to get catalog items
        const response = await catalogAPI.getAllItems(filters)

        // Update state with the fetched data
        setLibraryItems(response.data)

        // Extract unique genres and item types for filters
        const uniqueGenres = ["All", ...new Set(response.data.map((item: any) => item.genre))]
        const uniqueTypes = ["All", ...new Set(response.data.map((item: any) => item.type))]

        setGenres(uniqueGenres)
        setItemTypes(uniqueTypes)

        // Show success notification
        toast({
          title: "API Success",
          description: `Loaded ${response.data.length} catalog items`,
          variant: "success",
        })
      } catch (error) {
        console.error("Error fetching catalog data:", error)

        // Show error notification
        toast({
          title: "API Error",
          description: `Failed to fetch catalog items: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCatalogData()
  }, [selectedGenre, selectedItemType, availabilityFilter, toast])

  // Handle search functionality
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === "") return

      setIsLoading(true)

      // Show API notification for search request
      toast({
        title: "API Request",
        description: `GET /api/catalog/search?q=${searchTerm} - Searching catalog...`,
        variant: "default",
      })

      try {
        // Call the API function to search items
        const response = await catalogAPI.searchItems(searchTerm)

        // Update state with search results
        setLibraryItems(response.data)

        // Show success notification
        toast({
          title: "API Success",
          description: `Found ${response.data.length} items matching "${searchTerm}"`,
          variant: "success",
        })
      } catch (error) {
        console.error("Error searching catalog:", error)

        // Show error notification
        toast({
          title: "API Error",
          description: `Search failed: ${error instanceof Error ? error.message : "Unknown error"}`,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    // Debounce search to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim().length >= 3) {
        handleSearch()
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm, toast])

  // Filter items based on search term, genre, item type, and availability
  const filteredItems = libraryItems.filter((item: any) => {
    // If we're already filtering via API, we don't need to filter again
    // This is just a fallback for client-side filtering
    return true
  })

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
              href={userRole === "borrower" ? "/dashboard/borrower" : "/dashboard/librarian"}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">{userRole === "borrower" ? "John Doe" : "Admin"}</span>
            </div>
            <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Library Catalog</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-[#39FF14] text-black" : "bg-gray-200 text-gray-700"}`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-[#39FF14] text-black" : "bg-gray-200 text-gray-700"}`}
            >
              List
            </button>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => setUserRole("borrower")}
                className={`p-2 rounded ${userRole === "borrower" ? "bg-[#39FF14] text-black" : "bg-gray-200 text-gray-700"}`}
              >
                Test as Borrower
              </button>
              <button
                onClick={() => setUserRole("librarian")}
                className={`p-2 rounded ${userRole === "librarian" ? "bg-[#39FF14] text-black" : "bg-gray-200 text-gray-700"}`}
              >
                Test as Librarian
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-[#39FF14]/30">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by title, creator, or description..."
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
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {selectedItemType === "All" ? (
                    <Book className="h-5 w-5 text-gray-400" />
                  ) : (
                    getItemTypeIcon(selectedItemType)
                  )}
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={selectedItemType}
                  onChange={(e) => setSelectedItemType(e.target.value)}
                >
                  {itemTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Book className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  className="pl-10 h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                >
                  <option value="all">All Items</option>
                  <option value="available">Available Only</option>
                  <option value="unavailable">Unavailable Only</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]"></div>
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="mb-4 text-gray-600">
              Showing {filteredItems.length} of {libraryItems.length} items
            </div>

            {/* Items Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex flex-col h-full">
                      <div className="flex justify-center mb-4">
                        <img
                          src={item.coverUrl || "/placeholder.svg?height=200&width=150"}
                          alt={`Cover of ${item.title}`}
                          className="h-48 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getItemTypeIcon(item.type)}
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {getCreatorLabel(item.type)}: {item.creator}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.genre}</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.year}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                          {item.type === "audiobook" && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {item.duration}
                            </span>
                          )}
                          {item.type === "dvd" && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {item.runtime}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                      </div>
                      <div className="mt-auto flex gap-2">
                        <Link
                          href={`/catalog/${item.type}/${item.id}`}
                          className="flex-1 inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                          onClick={() => {
                            // Show API notification for viewing item details
                            toast({
                              title: "API Request",
                              description: `GET /api/catalog/${item.type}/${item.id} - Fetching item details`,
                              variant: "default",
                            })
                          }}
                        >
                          View Details
                        </Link>

                        {userRole === "borrower" && item.available && (
                          <Link
                            href={`/borrow/${item.type}/${item.id}`}
                            className="inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={() => {
                              // Show API notification for borrow request
                              toast({
                                title: "API Request",
                                description: `GET /api/borrow/${item.type}/${item.id} - Preparing borrow request`,
                                variant: "default",
                              })
                            }}
                          >
                            Borrow
                          </Link>
                        )}

                        {userRole === "librarian" && (
                          <button
                            className="inline-flex items-center justify-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                            onClick={() => {
                              // Show API notification for edit request
                              toast({
                                title: "API Request",
                                description: `GET /api/catalog/${item.type}/${item.id}/edit - Fetching item for editing`,
                                variant: "default",
                              })
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden border border-[#39FF14]/30 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 flex gap-4">
                      <img
                        src={item.coverUrl || "/placeholder.svg?height=60&width=40"}
                        alt={`Cover of ${item.title}`}
                        className="h-32 w-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getItemTypeIcon(item.type)}
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                            {item.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {getCreatorLabel(item.type)}: {item.creator}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.genre}</span>
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.year}</span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {item.available ? "Available" : "Unavailable"}
                          </span>
                          {item.type === "audiobook" && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {item.duration}
                            </span>
                          )}
                          {item.type === "dvd" && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                              {item.runtime}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                        <div className="flex gap-2">
                          <Link
                            href={`/catalog/${item.type}/${item.id}`}
                            className="inline-flex justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                            onClick={() => {
                              // Show API notification for viewing item details
                              toast({
                                title: "API Request",
                                description: `GET /api/catalog/${item.type}/${item.id} - Fetching item details`,
                                variant: "default",
                              })
                            }}
                          >
                            View Details
                          </Link>

                          {userRole === "borrower" && item.available && (
                            <Link
                              href={`/borrow/${item.type}/${item.id}`}
                              className="inline-flex justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                              onClick={() => {
                                // Show API notification for borrow request
                                toast({
                                  title: "API Request",
                                  description: `GET /api/borrow/${item.type}/${item.id} - Preparing borrow request`,
                                  variant: "default",
                                })
                              }}
                            >
                              Borrow
                            </Link>
                          )}

                          {userRole === "librarian" && (
                            <button
                              className="inline-flex items-center justify-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 shadow transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                              onClick={() => {
                                // Show API notification for edit request
                                toast({
                                  title: "API Request",
                                  description: `GET /api/catalog/${item.type}/${item.id}/edit - Fetching item for editing`,
                                  variant: "default",
                                })
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Add New Item Button (Librarian Only) */}
        {userRole === "librarian" && (
          <div className="fixed bottom-8 right-8">
            <button
              className="flex items-center justify-center w-14 h-14 rounded-full bg-[#39FF14] text-black shadow-lg hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] transition-colors"
              onClick={() => {
                // Show API notification for adding new item
                toast({
                  title: "API Request",
                  description: "GET /api/catalog/new - Loading new item form",
                  variant: "default",
                })
              }}
            >
              <Plus className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

