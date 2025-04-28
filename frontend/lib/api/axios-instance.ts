// lib/api/axios-instance.ts
import axios from "axios"

// 1. Require the env var — no more silent fallback
const rawBase = process.env.NEXT_PUBLIC_API_URL
if (!rawBase) {
  throw new Error(
    "❌ NEXT_PUBLIC_API_URL is missing in .env.local! " +
    "Please add:\n\n  NEXT_PUBLIC_API_URL=https://your.library-api.example.com/api\n"
  )
}

// 2. Normalize (strip trailing slash) and export
export const API_BASE_URL = rawBase.replace(/\/$/, "")
console.log("🛠️  API_BASE_URL is:", API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token")
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export default api
