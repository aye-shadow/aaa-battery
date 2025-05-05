"use client";
import Link from "next/link"
import authAPI from "@/lib/api/auth" 
import { useRouter } from "next/navigation" 
import { useEffect, useState } from "react" 
import {
  BookOpen,
  Book,
  Clock,
  CreditCard,
  Calendar,
  PlusCircle,
  Bell,
  Settings,
  LogOut,
  User,
  RefreshCw,
  BookPlus,
} from "lucide-react"

export default function BorrowerDashboard() {
  const [firstName, setFirstName] = useState<string>("")    // 👈 add state
  const router = useRouter()  
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
          <Link
            href="/dashboard/borrower/returns"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Clock className="h-5 w-5" />
            <span>My Loans</span>
          </Link>
          <Link
            href="/dashboard/borrower/request"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <BookPlus className="h-5 w-5" />
            <span>Request Content</span>
          </Link>
          <Link
            href="/dashboard/borrower/fines"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <CreditCard className="h-5 w-5" />
            <span>Fines</span>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <Bell className="h-5 w-5" />
            <span>Notifications</span>
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
            <h1 className="text-3xl font-bold text-gray-800">Borrower Dashboard</h1>
            <p className="text-gray-600">Welcome back{firstName ? `, ${firstName}` : ""} </p>
          </div>
          <Link href="/profile">
          <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
            <User className="h-6 w-6 text-[#39FF14]" />
            <span className="text-gray-800 font-medium">My Profile</span>
          </div>
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Stats cards */}
          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Current Loans</h2>
              <Book className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">3</p>
            <p className="text-gray-600 mt-1">Books currently borrowed</p>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Outstanding Fines</h2>
              <CreditCard className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">$6.00</p>
            <p className="text-gray-600 mt-1">
              <Link href="/dashboard/borrower/fines" className="text-[#39FF14] hover:underline">
                Pay now
              </Link>
            </p>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <Bell className="h-5 w-5 text-[#39FF14]" />
            </div>
            <p className="text-4xl font-bold text-[#39FF14]">2</p>
            <p className="text-gray-600 mt-1">Unread notifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Current Borrowed Items</h2>
              <Link
                href="/dashboard/borrower/returns"
                className="text-sm text-[#39FF14] hover:underline flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Return Items
              </Link>
            </div>
            <div className="space-y-4">
              {[
                { title: "The Great Gatsby", author: "F. Scott Fitzgerald", due: "May 15, 2023" },
                { title: "To Kill a Mockingbird", author: "Harper Lee", due: "May 20, 2023" },
                { title: "1984", author: "George Orwell", due: "May 25, 2023" },
              ].map((book, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <div>
                    <h3 className="font-medium text-gray-800">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs bg-[#39FF14]/20 text-[#39FF14] px-2 py-1 rounded-full">
                      Due: {book.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Recent Notifications</h2>
              <Link
                href="/dashboard/borrower/request"
                className="text-sm text-[#39FF14] hover:underline flex items-center"
              >
                <BookPlus className="h-4 w-4 mr-1" />
                Request New Content
              </Link>
            </div>
            <div className="space-y-4">
              <div className="p-3 bg-[#39FF14]/5 border-l-2 border-[#39FF14] rounded-md">
                <h3 className="font-medium text-gray-800">Book Available</h3>
                <p className="text-sm text-gray-600">"Dune" by Frank Herbert is now available for pickup.</p>
                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-[#39FF14]/5 border-l-2 border-[#39FF14] rounded-md">
                <h3 className="font-medium text-gray-800">Due Date Approaching</h3>
                <p className="text-sm text-gray-600">"The Great Gatsby" is due in 3 days. Consider renewing.</p>
                <p className="text-xs text-gray-500 mt-1">1 day ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link
              href="/catalog"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <Book className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">View Catalog</span>
            </Link>
            <Link
              href="/catalog"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <PlusCircle className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Borrow Content</span>
            </Link>
            <Link
              href="/dashboard/borrower/returns"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <RefreshCw className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Return Content</span>
            </Link>
            <Link
              href="/dashboard/borrower/request"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <BookPlus className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Request New Book</span>
            </Link>
            <Link
              href="/dashboard/borrower/fines"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors"
            >
              <CreditCard className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Pay Fines</span>
            </Link>
            <button className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-[#39FF14]/10 transition-colors">
              <Calendar className="h-8 w-8 text-[#39FF14] mb-2" />
              <span className="text-sm text-gray-800 text-center">Extend Deadline</span>
            </button>
          </div>
        </div>

        <div className="bg-white border-[#39FF14]/30 shadow-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Reading History</h2>
          <div className="space-y-4">
            {[
              { title: "Pride and Prejudice", author: "Jane Austen", returned: "April 10, 2023" },
              { title: "The Hobbit", author: "J.R.R. Tolkien", returned: "March 25, 2023" },
              { title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", returned: "March 15, 2023" },
              { title: "The Catcher in the Rye", author: "J.D. Salinger", returned: "February 28, 2023" },
            ].map((book, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div>
                  <h3 className="font-medium text-gray-800">{book.title}</h3>
                  <p className="text-sm text-gray-600">{book.author}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">Returned: {book.returned}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
