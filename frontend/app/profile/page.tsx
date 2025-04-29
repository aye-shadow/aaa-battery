"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowLeft, User, LogOut, Key } from "lucide-react"
import { authAPI } from "@/lib/api/auth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<{
    fullName: string
    email: string
    role: "BORROWER" | "LIBRARIAN"
  } | null>(null)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isChanging, setIsChanging] = useState(false)

  const { apiToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await authAPI.getCurrentUser()
        apiToast(
          "Profile Loaded",
          "Your profile information has been loaded successfully.",
          "GET",
          "/api/user/me",
          "info"
        )
        setUser({
          fullName: data.fullName,
          email: data.email,
          role: data.role === "LIBRARIAN" ? "LIBRARIAN" : "BORROWER",
        })
      } catch {
        apiToast(
          "Error",
          "Could not load your profile — please log in again.",
          "GET",
          "/api/user/me",
          "destructive"
        )
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }
    loadProfile()
  }, [apiToast, router])

  const handleLogout = async () => {
    await authAPI.logout()
    apiToast("Logged Out", "You have been logged out.", "POST", "/api/auth/logout", "info")
    router.push("/auth")
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage("❌ New passwords do not match.")
      return
    }

    setIsChanging(true)
    try {
      const resultText = await authAPI.changePassword(currentPassword, newPassword)
      setMessage(resultText)            // show the plain-text response
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      setMessage(err.message || "Failed to change password")
    } finally {
      setIsChanging(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#39FF14] border-r-transparent" />
          <p className="mt-4 text-gray-600">Loading profile…</p>
        </div>
      </div>
    )
  }

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
              href={user!.role === "BORROWER" ? "/dashboard/borrower" : "/dashboard/librarian"}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" /> Back
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">{user!.fullName}</span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PROFILE INFO */}
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="h-5 w-5 text-[#39FF14] mr-2" />
              Profile Information
            </h2>

            <p className="text-3xl font-bold text-gray-900">{user!.fullName}</p>
            <div className="mt-4 space-y-2">
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Email:</span> {user!.email}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Role:</span>{" "}
                {user!.role === "LIBRARIAN" ? "Librarian" : "Borrower"}
              </p>
            </div>
          </div>

          {/* CHANGE PASSWORD */}
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Key className="h-5 w-5 text-[#39FF14] mr-2" />
              Change Password
            </h2>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                />
              </div>

              <button
                type="submit"
                disabled={isChanging}
                className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
              >
                {isChanging && (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent mr-2" />
                )}
                Change Password
              </button>

              {/* server response message */}
              {message && (
                <p className="mt-2 text-sm text-green-700">
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
