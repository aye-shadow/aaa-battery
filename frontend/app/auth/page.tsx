"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, ArrowLeft } from "lucide-react"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function AuthPage() {
  // State for form fields
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [firstName, setFirstName] = useState<string>("")
  const [lastName, setLastName] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<string>("signin")
  const [userRole, setUserRole] = useState<string>("borrower")
  const router = useRouter()
  const { apiToast } = useToast()

  // Add a state for error messages at the top of the component
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if there's a tab parameter in the URL
    const tabParam = searchParams.get("tab")
    if (tabParam === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  // Update the handleSignIn function to properly handle role-based authentication
  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    // Clear any previous errors
    setError(null)

    try {
      // Convert userRole to uppercase to match API expectations
      const apiRole = userRole.toUpperCase()
      console.log(`Attempting to login with email: ${email}, role: ${apiRole}`)

      // Call the login API endpoint
      const response = await authAPI.login(email, password, apiRole)

      // Show success toast with API details
      apiToast("Login Successful", "You have been successfully logged in.", "POST", "/api/auth/login", "success")

      // Store the token in localStorage
      localStorage.setItem("auth_token", response.data.token)
      // This will ensure the user role is saved when logging in
      localStorage.setItem("userRole", userRole)

      // Redirect based on role
      setTimeout(() => {
        setIsLoading(false)
        if (userRole === "borrower") {
          router.push("/dashboard/borrower")
        } else {
          router.push("/dashboard/librarian")
        }
      }, 1000)
    } catch (error) {
      console.error("Login error:", error)

      // Set the error message to display on the page
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unexpected error occurred. Please try again.")
      }

      // Show error toast with API details
      apiToast(
        "Login Failed",
        `Unable to login: ${error instanceof Error ? error.message : "Network error"}`,
        "POST",
        "/api/auth/login",
        "destructive",
      )

      setIsLoading(false)
    }
  }

  
  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  
    if (password !== confirmPassword) {
      apiToast(
        "Registration Error",
        "Passwords do not match. Please try again.",
        "POST",
        "/api/auth/signup",
        "destructive",
      )
      return
    }
  
    setIsLoading(true)
  
    try {
      const userData = {
        fullName: `${firstName} ${lastName}`,
        email,
        password,
        role: userRole.toUpperCase(),
      }
  
      const response = await authAPI.register(userData)
  
      apiToast(
        "Registration Successful",
        "Your account has been created successfully. Please sign in.",
        "POST",
        "/api/auth/signup",
        "success",
      )
  
      // ✅ After successful signup: move user to login tab
      setActiveTab("signin")
      setIsLoading(false)
  
    } catch (error) {
      console.error("Registration error:", error)
  
      apiToast(
        "Registration Failed",
        error instanceof Error ? error.message : "An unexpected error occurred.",
        "POST",
        "/api/auth/signup",
        "destructive",
      )
  
      setIsLoading(false)
    }
  }
  
  

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="absolute top-4 left-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium text-gray-600 hover:text-gray-800 h-10 px-4 py-2"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-md border-2 border-[#39FF14] bg-white shadow-md rounded-lg overflow-hidden">
        <div className="space-y-2 text-center p-6 border-b border-gray-200">
          <div className="flex justify-center mb-2">
            <BookOpen size={40} className="text-[#39FF14]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">LibraryPro</h1>
          <p className="text-gray-500">Sign in to your account or create a new one</p>
        </div>
        <div className="px-6">
          <div className="w-full">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("signin")}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === "signin"
                    ? "text-black bg-[#39FF14] border-b-2 border-[#39FF14]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab("signup")}
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === "signup"
                    ? "text-black bg-[#39FF14] border-b-2 border-[#39FF14]"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Sign Up
              </button>
            </div>

            {activeTab === "signin" && (
              <form onSubmit={handleSignIn} className="py-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    <p className="text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <a href="#" className="text-xs text-[#39FF14] hover:underline">
                        Forgot password?
                      </a>
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">I am a:</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setUserRole("borrower")}
                        className={`flex-1 py-2 px-4 text-center font-medium ${
                          userRole === "borrower"
                            ? "bg-[#39FF14] text-black"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Borrower
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserRole("librarian")}
                        className={`flex-1 py-2 px-4 text-center font-medium ${
                          userRole === "librarian"
                            ? "bg-[#39FF14] text-black"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Librarian
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "signup" && (
              <form onSubmit={handleSignUp} className="py-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                      </label>
                      <input
                        id="firstName"
                        placeholder="John"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                      </label>
                      <input
                        id="lastName"
                        placeholder="Doe"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      id="signup-email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#39FF14] focus:border-[#39FF14]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Register as:</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setUserRole("borrower")}
                        className={`flex-1 py-2 px-4 text-center font-medium ${
                          userRole === "borrower"
                            ? "bg-[#39FF14] text-black"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Borrower
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserRole("librarian")}
                        className={`flex-1 py-2 px-4 text-center font-medium ${
                          userRole === "librarian"
                            ? "bg-[#39FF14] text-black"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        Librarian
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow transition-colors hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14] disabled:opacity-50"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
