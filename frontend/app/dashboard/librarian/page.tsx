"use client";
import Link from "next/link"
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react" 
import authAPI from "@/lib/api/auth" 
import {
  BookOpen,
  Book,
  Users,
  Clock,
  Settings,
  LogOut,
  User,
  PlusCircle,
  Edit,
  CheckSquare,
  FileText,
  CreditCard,
  FileSearch,
  History,
} from "lucide-react"



export default function LibrarianDashboard() {
  const router = useRouter()  
    const [firstName, setFirstName] = useState<string>("")    // 👈 add state
  
    useEffect(() => {
      const storedFirstName = localStorage.getItem("userFirstName") || ""
      setFirstName(storedFirstName)
    }, []) 
    
    const handleLogout = async () => {              // 👈 ADD THIS
      try {
        await authAPI.logout()
        router.push("/auth")                        // 👈 redirect to login page after logout
      } catch (error) {
        console.error("Logout failed:", error)
        alert("Logout failed. Please try again.")
      }
    }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-[#39FF14]/30 shadow-sm">
        <div className="flex items-center gap-2 p-6 border-b border-[#39FF14]/30">
          <BookOpen className="h-6 w-6 text-[#39FF14]" />
          <h1 className="text-xl font-bold text-gray-800">LibraryPro</h1>
        </div>
        <nav className="p-4 space-y-2">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-800 bg-[#39FF14]/10 rounded-md border-l-2 border-[#39FF14]"
          >
            <Book className="h-5 w-5 text-[#39FF14]" />
            <span>Dashboard</span>
          </a>
          <Link
            href="/catalog"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <BookOpen className="h-5 w-5" />
            <span>Catalog</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Users className="h-5 w-5" />
            <span>Members</span>
          </a>
          <Link
            href="/dashboard/librarian/borrows"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Clock className="h-5 w-5" />
            <span>Loans</span>
          </Link>
          <Link
            href="/dashboard/librarian/fines"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <CreditCard className="h-5 w-5" />
            <span>Fines</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <FileText className="h-5 w-5" />
            <span>Reports</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </a>
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-[#39FF14]/30">
        <button
          onClick={handleLogout}
          className="flex items-center justify-start gap-2 w-full px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Librarian Dashboard</h1>
            <p className="text-gray-600">Welcome back{firstName ? `, ${firstName}` : ""} </p>
          </div>
          <Link href="/profile">
          <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
            <User className="h-6 w-6 text-[#39FF14]" />
            <span className="text-gray-800 font-medium">My Profile</span>
          </div>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Stats cards */}
          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Books</h2>
              <Book className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">2,543</p>
            <p className="text-gray-600 mt-1">In collection</p>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Active Loans</h2>
              <Clock className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">187</p>
            <p className="text-gray-600 mt-1">Books currently on loan</p>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
              <CheckSquare className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">12</p>
            <p className="text-gray-600 mt-1">Awaiting approval</p>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Overdue Items</h2>
              <CreditCard className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">23</p>
            <p className="text-gray-600 mt-1">Past due date</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Pending Borrow Requests</h2>
              <Link
                href="/dashboard/librarian/borrows"
                className="text-sm text-[#39FF14] hover:underline flex items-center"
              >
                <FileSearch className="h-4 w-4 mr-1" />
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "The Great Gatsby",
                  author: "F. Scott Fitzgerald",
                  requester: "John Doe",
                  date: "May 15, 2023",
                },
                {
                  title: "To Kill a Mockingbird",
                  author: "Harper Lee",
                  requester: "Sarah Johnson",
                  date: "May 16, 2023",
                },
                {
                  title: "The Shawshank Redemption",
                  author: "Frank Darabont",
                  requester: "Michael Brown",
                  date: "May 15, 2023",
                },
              ].map((book, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                    <p className="text-xs text-gray-500">Requested by: {book.requester}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 bg-[#39FF14]/10 text-[#39FF14] rounded hover:bg-[#39FF14]/20">
                      <CheckSquare className="h-5 w-5" />
                    </button>
                    <button className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200">
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Fine Payments</h2>
              <Link
                href="/dashboard/librarian/fines/history"
                className="text-sm text-[#39FF14] hover:underline flex items-center"
              >
                <History className="h-4 w-4 mr-1" />
                View All
              </Link>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">Fine Paid</h3>
                  <span className="text-xs text-gray-500">10:23 AM</span>
                </div>
                <p className="text-sm text-gray-600">$1.25 paid by John Doe for "1984"</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">Fine Paid</h3>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600">$3.50 paid by Sarah Johnson for "The Shawshank Redemption"</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex justify-between">
                  <h3 className="font-medium text-gray-800">Fine Waived</h3>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
                <p className="text-sm text-gray-600">$2.00 waived for Emma Wilson for "To Kill a Mockingbird"</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors">
              <PlusCircle className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Add New Content</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors">
              <Edit className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Update Content</span>
            </button>
            <Link
              href="/dashboard/librarian/borrows"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <CheckSquare className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Manage Borrows</span>
            </Link>
            <Link
              href="/dashboard/librarian/fines"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <CreditCard className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Manage Fines</span>
            </Link>
            <Link
              href="/dashboard/librarian/fines/history"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <History className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Payment History</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
