// lib/api/auth.ts
import { API_BASE_URL } from "./axios-instance"

export interface LoginResponse {
  token: string
  expiresIn: number
  message: string
}

export const authAPI = {
  login: async (
    email: string,
    password: string,
    role: "BORROWER" | "LIBRARIAN" = "BORROWER"
  ): Promise<{ data: LoginResponse & { user: { email: string; role: string; id: number; firstName: string; lastName: string } } }> => {
    console.log(
      `🛠️  login() → POST ${API_BASE_URL}/auth/login`,
      { email, role }
    )
  
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
        role: role.toUpperCase(),
      }),
    })
  
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Login failed:", errorText)
      throw new Error("Invalid credentials")
    }
  
    const responseData = await response.json()
  
    console.log("✅ Response JSON:", responseData)
  
    if (!responseData.token) {
      console.error("Login failed: No token in response:", responseData)
      throw new Error(responseData.message || "Invalid credentials")
    }
  
    // 👇 create a new data structure that includes user info
    const fullData = {
      ...responseData,
      user: {
        email,
        role: role.toLowerCase(),
        id: 0,             // you can set id=0 for now, or update later
        firstName: email,     // empty by default, or fetch from profile later
        lastName: "",
      }
    }
  
    // Store everything you need in localStorage
    localStorage.setItem("auth_token", fullData.token)
    localStorage.setItem("userPassword", password) 
    localStorage.setItem("userRole", fullData.user.role)
    localStorage.setItem("userEmail", fullData.user.email)
    localStorage.setItem("userFirstName", fullData.user.firstName)
    localStorage.setItem("userLastName", fullData.user.lastName)
  
    return { data: fullData }
  },
  

  register: async (userData: { fullName: string; email: string; password: string; role: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {    // 👈 Corrected endpoint
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
  
    const responseText = await response.text()
  
    if (!response.ok) {
      console.error("Registration failed:", responseText)
      throw new Error("Registration failed")
    }
  
    if (!responseText) {   // 👈 Check if server returned empty (user exists case)
      console.error("Registration failed: User already exists")
      throw new Error("User already exists")
    }
  
    const responseData = JSON.parse(responseText)
  
    console.log("✅ Registration successful:", responseData)
    return responseData
  },

  logout: async () => {
    const email = localStorage.getItem("userEmail")
    const password = localStorage.getItem("userPassword")
    const role = (localStorage.getItem("userRole") || "borrower").toUpperCase()
  
    if (!email || !password) {
      console.error("Logout failed: Missing email or password in localStorage.")
      throw new Error("Logout failed: Missing credentials.")
    }
  
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",   // IMPORTANT
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    })
  
    const responseText = await response.text()   // 👈 read raw text first!
  
    if (!response.ok) {
      console.error("Logout failed:", responseText)
      throw new Error(responseText || "Logout failed")
    }
  
    console.log("✅ Logout successful:", responseText)
  
    // Clear localStorage after successful logout
    localStorage.removeItem("auth_token")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userPassword")
    localStorage.removeItem("userFirstName")
    localStorage.removeItem("userLastName")
  
    return { message: responseText }
  },
  

  changePassword: async (oldPassword: string, newPassword: string): Promise<string> => {
    const form = new FormData()
    form.append("oldPassword", oldPassword)
    form.append("newPassword", newPassword)

    const res = await fetch(
      `${API_BASE_URL}/user/change-password`,
      {
        method: "POST",
        credentials: "include",
        body: form,
      }
    )

    const text = await res.text()
    if (!res.ok) {
      console.error("❌ changePassword failed:", text)
      throw new Error(text || "Failed to change password")
    }

    return text
  },

  getUserProfile: async (userId: number) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Get user profile failed")
    }

    return await response.json()
  },

  updateUserProfile: async (userId: number, profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/auth/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })

    if (!response.ok) {
      throw new Error("Update profile failed")
    }

    return await response.json()
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/user/me`, {
      method: "GET",
      credentials: "include",
    })
    if (!response.ok) {
      const txt = await response.text()
      console.error("Fetch current user failed:", txt)
      throw new Error("Failed to fetch current user")
    }
    return response.json()
  }
}

// **important**: so you can `import authAPI from "@/lib/api/auth"`
export default authAPI
