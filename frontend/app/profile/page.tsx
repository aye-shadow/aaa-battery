"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowLeft, User, LogOut, Save, Key } from "lucide-react"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  // State for user data
  const [userData, setUserData] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    role: "",
  })

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const router = useRouter()
  const { apiToast } = useToast()

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, we would get the user ID from the auth context
        // For demo purposes, we'll use a hardcoded ID
        const userId = 101 // John Doe's ID

        const response = await authAPI.getUserProfile(userId)

        // Show API notification
        apiToast(
          "Profile Loaded",
          "Your profile information has been loaded successfully.",
          "GET",
          `/api/auth/users/${userId}`,
          "info",
        )

        setUserData(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching user profile:", error)

        // Show error notification
        apiToast(
          "Error Loading Profile",
          "Failed to load your profile information. Please try again.",
          "GET",
          "/api/auth/users/profile",
          "destructive",
        )

        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [apiToast])

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const updatedData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      }

      const response = await authAPI.updateUserProfile(userData.id, updatedData)

      // Show success notification
      apiToast(
        "Profile Updated",
        "Your profile has been updated successfully.",
        "PUT",
        `/api/auth/users/${userData.id}`,
        "success",
      )

      setUserData(response.data)
      setIsSaving(false)
    } catch (error) {
      console.error("Error updating profile:", error)

      // Show error notification
      apiToast(
        "Update Failed",
        "Failed to update your profile. Please try again.",
        "PUT",
        `/api/auth/users/${userData.id}`,
        "destructive",
      )

      setIsSaving(false)
    }
  }

  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      apiToast(
        "Password Error",
        "New passwords do not match. Please try again.",
        "PUT",
        `/api/auth/users/${userData.id}/password`,
        "destructive",
      )
      return
    }

    setIsChangingPassword(true)

    try {
      await authAPI.changePassword(userData.id, currentPassword, newPassword)

      // Show success notification
      apiToast(
        "Password Changed",
        "Your password has been changed successfully.",
        "PUT",
        `/api/auth/users/${userData.id}/password`,
        "success",
      )

      // Reset password fields
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setIsChangingPassword(false)
    } catch (error) {
      console.error("Error changing password:", error)

      // Show error notification
      apiToast(
        "Password Change Failed",
        "Failed to change your password. Please ensure your current password is correct.",
        "PUT",
        `/api/auth/users/${userData.id}/password`,
        "destructive",
      )

      setIsChangingPassword(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout()

      // Show success notification
      apiToast("Logged Out", "You have been successfully logged out.", "POST", "/api/auth/logout", "info")

      // Clear local storage and redirect to login
      localStorage.removeItem("auth_token")
      router.push("/auth")
    } catch (error) {
      console.error("Error logging out:", error)
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
            <Link
              href={userData.role === "borrower" ? "/dashboard/borrower" : "/dashboard/librarian"}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">
                {userData.firstName} {userData.lastName}
              </span>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30 p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#39FF14] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading your profile information...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <User className="h-5 w-5 text-[#39FF14] mr-2" />
                  Profile Information
                </h2>

                <form onSubmit={handleUpdateProfile}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          value={userData.firstName}
                          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <input
                          id="lastName"
                          type="text"
                          value={userData.lastName}
                          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <input
                        id="role"
                        type="text"
                        value={userData.role === "borrower" ? "Borrower" : "Librarian"}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        disabled
                      />
                      <p className="text-xs text-gray-500">Your role cannot be changed</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-sm border border-[#39FF14]/30">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <Key className="h-5 w-5 text-[#39FF14] mr-2" />
                  Change Password
                </h2>

                <form onSubmit={handleChangePassword}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
                      disabled={isChangingPassword}
                    >
                      {isChangingPassword ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <Key className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

