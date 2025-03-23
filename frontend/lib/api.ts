// lib/api.ts
// This file contains all API calls to the backend server
//
// DEVELOPER GUIDE FOR DUMMY DATA IMPLEMENTATION:
// ----------------------------------------------
// This API layer provides a complete simulation of backend functionality using dummy data.
// When NEXT_PUBLIC_API_URL is not set, the system automatically uses dummy data instead of real API calls.
//
// How to use:
// 1. For development: Don't set NEXT_PUBLIC_API_URL to use dummy data
// 2. For production: Set NEXT_PUBLIC_API_URL to your actual API endpoint
//
// All API calls will show toast notifications with:
// - The operation being performed
// - The HTTP method (GET, POST, PUT, DELETE)
// - The endpoint being called
// - A note indicating dummy data is being used when appropriate
//
// The dummy data implementation follows these patterns:
// - GET requests: Return data from the dummy data store
// - POST/PUT requests: Simulate creating/updating data and return the result
// - DELETE requests: Simulate deletion and return success
//
// To modify dummy data behavior, update the corresponding functions below
// or add new dummy data in the lib/dummy-data.ts file.

import axios from "axios"
import { dummyData } from "./dummy-data"

// Base URL for API calls - would be configured based on environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Flag to determine if we should use dummy data or real API
// Set to true if no API URL is provided
const USE_DUMMY_DATA = !API_BASE_URL

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if it exists
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Helper function to simulate API delay
const simulateApiDelay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms))

// API endpoints for authentication
export const authAPI = {
  // Login functionality - works for both librarian and borrower
  login: async (email: string, password: string) => {
    /* 
// Request Format:
{
  "email": "john@example.com",
  "password": "password123"
}
// Response Format:
{
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 101,
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "borrower"
    }
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Check credentials against dummy data
      const user = dummyData.users.find((user) => user.email === email && user.password === password)

      if (user) {
        return {
          data: {
            token: "dummy-auth-token",
            user: { ...user, password: undefined },
          },
        }
      } else {
        throw new Error("Invalid credentials")
      }
    }

    // Real API call
    return api.post("/auth/login", { email, password })
  },

  // Registration functionality - works for both librarian and borrower
  register: async (userData: any) => {
    /* 
// Request Format:
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "role": "borrower"
}
// Response Format:
{
  "data": {
    "token": "jwt-token-here",
    "user": {
      "id": 103,
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "borrower",
      "createdAt": "2023-06-15T10:30:00Z"
    }
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Check if email already exists
      const existingUser = dummyData.users.find((user) => user.email === userData.email)
      if (existingUser) {
        throw new Error("Email already in use")
      }

      // Create new user
      const newUser = {
        id: dummyData.users.length + 1,
        ...userData,
        createdAt: new Date().toISOString(),
      }

      // In a real app, this would add to the database
      // Here we're just returning the user
      return {
        data: {
          token: "dummy-auth-token",
          user: { ...newUser, password: undefined },
        },
      }
    }

    // Real API call
    return api.post("/auth/register", userData)
  },

  // Logout functionality - works for both librarian and borrower
  logout: async () => {
    /* 
// Request Format: No body required, just the auth token in headers
// Response Format:
{
  "data": {
    "success": true
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Just return success
      return { data: { success: true } }
    }

    // Real API call
    return api.post("/auth/logout")
  },

  // Change password functionality - works for both librarian and borrower
  changePassword: async (userId: number, currentPassword: string, newPassword: string) => {
    /* 
// Request Format:
{
  "currentPassword": "oldPassword123",
  "newPassword": "newPassword456"
}
// Response Format:
{
  "data": {
    "success": true,
    "message": "Password changed successfully"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Find user
      const userIndex = dummyData.users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // Verify current password
      if (dummyData.users[userIndex].password !== currentPassword) {
        throw new Error("Current password is incorrect")
      }

      // In a real app, this would update the password in the database
      // Here we're just simulating success
      return {
        data: {
          success: true,
          message: "Password changed successfully",
        },
      }
    }

    // Real API call
    return api.put(`/auth/users/${userId}/password`, { currentPassword, newPassword })
  },

  // Get user profile - works for both librarian and borrower
  getUserProfile: async (userId: number) => {
    /* 
// Request Format: No body, just the userId in URL
// Response Format:
{
  "data": {
    "id": 101,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "borrower",
    "borrowerProfile": {
      "borrowCount": 3,
      "hasOverdue": false
    }
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Find user
      const user = dummyData.users.find((user) => user.id === userId)

      if (!user) {
        throw new Error("User not found")
      }

      // Return user without password
      return {
        data: {
          ...user,
          password: undefined,
        },
      }
    }

    // Real API call
    return api.get(`/auth/users/${userId}`)
  },

  // Update user profile - works for both librarian and borrower
  updateUserProfile: async (userId: number, profileData: any) => {
    /* 
// Request Format:
{
  "firstName": "John",
  "lastName": "Doe Updated",
  "email": "john.updated@example.com"
}
// Response Format:
{
  "data": {
    "id": 101,
    "firstName": "John",
    "lastName": "Doe Updated",
    "email": "john.updated@example.com",
    "role": "borrower"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Find user
      const userIndex = dummyData.users.findIndex((user) => user.id === userId)

      if (userIndex === -1) {
        throw new Error("User not found")
      }

      // In a real app, this would update the user in the database
      // Here we're just simulating success
      return {
        data: {
          ...dummyData.users[userIndex],
          ...profileData,
          password: undefined,
        },
      }
    }

    // Real API call
    return api.put(`/auth/users/${userId}`, profileData)
  },
}

// API endpoints for books and catalog
export const catalogAPI = {
  // Get all items - works for both librarian and borrower
  getAllItems: async (filters?: any) => {
    /* 
// Request Format: Query parameters
// Example: /catalog?type=book&genre=Fiction&available=true
// Response Format:
{
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "creator": "F. Scott Fitzgerald",
      "type": "book",
      "genre": "Fiction",
      "year": 1925,
      "available": true,
      "coverUrl": "/path/to/cover.jpg",
      "description": "A story of wealth, love, and the American Dream in the 1920s.",
      "borrowPeriod": 21
    },
    // More items...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let items = [...dummyData.libraryItems]

      // Apply filters if provided
      if (filters) {
        if (filters.type) {
          items = items.filter((item) => item.type === filters.type)
        }

        if (filters.available !== undefined) {
          items = items.filter((item) => item.available === filters.available)
        }

        if (filters.genre) {
          items = items.filter((item) => item.genre === filters.genre)
        }
      }

      return { data: items }
    }

    // Real API call
    return api.get("/catalog", { params: filters })
  },

  // Get item by ID - works for both librarian and borrower
  getItemById: async (type: string, id: number) => {
    /* 
// Request Format: No body, just the type and id in URL
// Example: /catalog/book/1
// Response Format:
{
  "data": {
    "id": 1,
    "title": "The Great Gatsby",
    "creator": "F. Scott Fitzgerald",
    "type": "book",
    "genre": "Fiction",
    "year": 1925,
    "available": true,
    "coverUrl": "/path/to/cover.jpg",
    "description": "A story of wealth, love, and the American Dream in the 1920s.",
    "borrowPeriod": 21,
    "isbn": "9780743273565",
    "publisher": "Scribner"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const item = dummyData.libraryItems.find((item) => item.id === id && item.type === type)

      if (!item) {
        throw new Error("Item not found")
      }

      return { data: item }
    }

    // Real API call
    return api.get(`/catalog/${type}/${id}`)
  },

  // Search items - works for both librarian and borrower
  searchItems: async (query: string) => {
    /* 
// Request Format: Query parameter
// Example: /catalog/search?q=gatsby
// Response Format:
{
  "data": [
    {
      "id": 1,
      "title": "The Great Gatsby",
      "creator": "F. Scott Fitzgerald",
      "type": "book",
      "genre": "Fiction",
      "year": 1925,
      "available": true,
      "coverUrl": "/path/to/cover.jpg",
      "description": "A story of wealth, love, and the American Dream in the 1920s."
    },
    // More matching items...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const searchLower = query.toLowerCase()
      const results = dummyData.libraryItems.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.creator.toLowerCase().includes(searchLower) ||
          (item.description && item.description.toLowerCase().includes(searchLower)),
      )

      return { data: results }
    }

    // Real API call
    return api.get(`/catalog/search`, { params: { q: query } })
  },

  // Add new item - librarian only
  addItem: async (itemData: any) => {
    /* 
// Request Format:
{
  "title": "New Book Title",
  "creator": "Author Name",
  "type": "book",
  "genre": "Science Fiction",
  "year": 2023,
  "description": "Description of the book",
  "isbn": "9781234567890",
  "coverUrl": "/path/to/cover.jpg",
  "borrowPeriod": 21
}
// Response Format:
{
  "data": {
    "id": 10,
    "title": "New Book Title",
    "creator": "Author Name",
    "type": "book",
    "genre": "Science Fiction",
    "year": 2023,
    "available": true,
    "description": "Description of the book",
    "isbn": "9781234567890",
    "coverUrl": "/path/to/cover.jpg",
    "borrowPeriod": 21
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Create new item with ID
      const newItem = {
        id: dummyData.libraryItems.length + 1,
        ...itemData,
        available: true,
      }

      // In a real app, this would add to the database
      return { data: newItem }
    }

    // Real API call
    return api.post("/catalog", itemData)
  },

  // Update item - librarian only
  updateItem: async (itemId: number, itemData: any) => {
    /* 
// Request Format:
{
  "title": "Updated Book Title",
  "description": "Updated description",
  "available": false
}
// Response Format:
{
  "data": {
    "id": 1,
    "title": "Updated Book Title",
    "creator": "F. Scott Fitzgerald",
    "type": "book",
    "genre": "Fiction",
    "year": 1925,
    "available": false,
    "coverUrl": "/path/to/cover.jpg",
    "description": "Updated description",
    "borrowPeriod": 21
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const itemIndex = dummyData.libraryItems.findIndex((item) => item.id === itemId)

      if (itemIndex === -1) {
        throw new Error("Item not found")
      }

      // In a real app, this would update the database
      const updatedItem = {
        ...dummyData.libraryItems[itemIndex],
        ...itemData,
      }

      return { data: updatedItem }
    }

    // Real API call
    return api.put(`/catalog/${itemId}`, itemData)
  },

  // Delete item - librarian only
  deleteItem: async (itemId: number) => {
    /* 
// Request Format: No body, just the itemId in URL
// Response Format:
{
  "data": {
    "success": true
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const itemIndex = dummyData.libraryItems.findIndex((item) => item.id === itemId)

      if (itemIndex === -1) {
        throw new Error("Item not found")
      }

      // In a real app, this would delete from the database
      return { data: { success: true } }
    }

    // Real API call
    return api.delete(`/catalog/${itemId}`)
  },
}

// API endpoints for borrow operations
export const borrowAPI = {
  // Get all borrow requests - librarian only
  getBorrowRequests: async (filters?: any) => {
    /* 
// Request Format: Query parameters
// Example: /borrows?status=pending
// Response Format:
{
  "data": [
    {
      "id": 1,
      "borrower": {
        "id": 101,
        "name": "John Doe",
        "email": "john@example.com",
        "borrowCount": 3,
        "hasOverdue": false
      },
      "item": {
        "id": 1,
        "title": "The Great Gatsby",
        "creator": "F. Scott Fitzgerald",
        "type": "book",
        "coverUrl": "/path/to/cover.jpg"
      },
      "requestDate": "2023-06-01T10:00:00Z",
      "borrowDate": "2023-06-05T10:00:00Z",
      "returnDate": "2023-06-26T10:00:00Z",
      "status": "pending",
      "notes": "First time borrowing this book"
    },
    // More borrow requests...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let requests = [...dummyData.borrowRequests]

      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status !== "all") {
          requests = requests.filter((request) => request.status === filters.status)
        }

        if (filters.userId) {
          requests = requests.filter((request) => request.borrower.id === filters.userId)
        }
      }

      return { data: requests }
    }

    // Real API call
    return api.get("/borrows", { params: filters })
  },

  // Submit borrow request - borrower only
  submitBorrowRequest: async (borrowData: any) => {
    /* 
// Request Format:
{
  "userId": 101,
  "itemId": 1,
  "borrowDate": "2023-06-05",
  "returnDate": "2023-06-26",
  "notes": "First time borrowing this book"
}
// Response Format:
{
  "data": {
    "id": 5,
    "borrower": {
      "id": 101,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "item": {
      "id": 1,
      "title": "The Great Gatsby",
      "creator": "F. Scott Fitzgerald",
      "type": "book"
    },
    "requestDate": "2023-06-01T10:00:00Z",
    "borrowDate": "2023-06-05T10:00:00Z",
    "returnDate": "2023-06-26T10:00:00Z",
    "status": "pending",
    "notes": "First time borrowing this book"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Check if item is available
      const item = dummyData.libraryItems.find((item) => item.id === borrowData.itemId)
      if (!item || !item.available) {
        throw new Error("Item is not available for borrowing")
      }

      // Create new borrow request
      const newRequest = {
        id: dummyData.borrowRequests.length + 1,
        borrower: dummyData.users.find((user) => user.id === borrowData.userId)?.borrowerProfile || {
          id: borrowData.userId,
          name: "John Doe",
          email: "john.doe@example.com",
          borrowCount: 1,
          hasOverdue: false,
        },
        item: item,
        requestDate: new Date().toISOString(),
        borrowDate: borrowData.borrowDate,
        returnDate: borrowData.returnDate,
        status: "pending",
        notes: borrowData.notes || "",
      }

      // In a real app, this would add to the database
      return { data: newRequest }
    }

    // Real API call
    return api.post("/borrows", borrowData)
  },

  // Approve borrow request - librarian only
  approveBorrowRequest: async (requestId: number) => {
    /* 
// Request Format: No body, just the requestId in URL
// Response Format:
{
  "data": {
    "id": 1,
    "status": "approved",
    "approvedBy": "Admin",
    "approvedAt": "2023-06-02T14:30:00Z"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const request = dummyData.borrowRequests.find((req) => req.id === requestId)
      if (!request) {
        throw new Error("Borrow request not found")
      }

      // Update request status
      const updatedRequest = { ...request, status: "approved" }

      // In a real app, this would update the database
      return { data: updatedRequest }
    }

    // Real API call
    return api.put(`/borrows/${requestId}/approve`)
  },

  // Decline borrow request - librarian only
  declineBorrowRequest: async (requestId: number) => {
    /* 
// Request Format: No body, just the requestId in URL
// Response Format:
{
  "data": {
    "id": 2,
    "status": "declined",
    "declinedBy": "Admin",
    "declinedAt": "2023-06-02T14:35:00Z"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const request = dummyData.borrowRequests.find((req) => req.id === requestId)
      if (!request) {
        throw new Error("Borrow request not found")
      }

      // Update request status
      const updatedRequest = { ...request, status: "declined" }

      // In a real app, this would update the database
      return { data: updatedRequest }
    }

    // Real API call
    return api.put(`/borrows/${requestId}/decline`)
  },

  // Return item - borrower only
  returnItem: async (borrowId: number) => {
    /* 
// Request Format: No body, just the borrowId in URL
// Response Format:
{
  "data": {
    "id": 1,
    "returnDate": "2023-06-20T09:15:00Z",
    "fine": 0,
    "status": "returned"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const borrowedItem = dummyData.borrowedItems.find((item) => item.id === borrowId)
      if (!borrowedItem) {
        throw new Error("Borrowed item not found")
      }

      // Update return date and calculate any fines
      const returnDate = new Date().toISOString()
      const dueDate = new Date(borrowedItem.dueDate)
      const returnDateObj = new Date(returnDate)

      let fine = 0
      if (returnDateObj > dueDate) {
        // Calculate days late
        const daysLate = Math.ceil((returnDateObj.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
        fine = daysLate * 0.25 // $0.25 per day late
      }

      const updatedItem = {
        ...borrowedItem,
        returnDate,
        fine,
        status: "returned",
      }

      // In a real app, this would update the database
      return { data: updatedItem }
    }

    // Real API call
    return api.put(`/borrows/${borrowId}/return`)
  },

  // Get borrowed items - works for both librarian and borrower
  getBorrowedItems: async (userId?: number) => {
    /* 
// Request Format: No body, just the userId in URL (optional)
// Response Format:
{
  "data": [
    {
      "id": 1,
      "item": {
        "id": 1,
        "title": "The Great Gatsby",
        "creator": "F. Scott Fitzgerald",
        "type": "book",
        "coverUrl": "/path/to/cover.jpg"
      },
      "borrower": {
        "id": 101,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "borrowDate": "2023-06-05T10:00:00Z",
      "dueDate": "2023-06-26T10:00:00Z",
      "status": "borrowed",
      "isOverdue": false
    },
    // More borrowed items...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let items = [...dummyData.borrowedItems]

      // Filter by user if provided
      if (userId) {
        items = items.filter((item) => item.borrower.id === userId)
      }

      return { data: items }
    }

    // Real API call
    const endpoint = userId ? `/borrows/user/${userId}` : "/borrows/user"
    return api.get(endpoint)
  },

  // Get borrow history - librarian only
  getBorrowHistory: async (filters?: any) => {
    /* 
// Request Format: Query parameters
// Example: /borrows/history?status=returned&userId=101&fromDate=2023-01-01&toDate=2023-06-30
// Response Format:
{
  "data": [
    {
      "id": 101,
      "item": {
        "id": 2,
        "title": "To Kill a Mockingbird",
        "creator": "Harper Lee",
        "type": "book",
        "coverUrl": "/path/to/cover.jpg"
      },
      "borrower": {
        "id": 101,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "borrowDate": "2023-04-01T10:00:00Z",
      "dueDate": "2023-04-22T10:00:00Z",
      "returnDate": "2023-04-20T15:30:00Z",
      "status": "returned",
      "isOverdue": false
    },
    // More borrow history items...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Combine current and past borrows for a complete history
      let history = [
        ...dummyData.borrowedItems,
        // Add some returned items to the history
        {
          id: 101,
          item: {
            id: 2,
            title: "To Kill a Mockingbird",
            creator: "Harper Lee",
            type: "book",
            coverUrl: "/placeholder.svg?height=60&width=40",
          },
          borrower: {
            id: 101,
            name: "John Doe",
            email: "john@example.com",
          },
          borrowDate: "2023-04-01",
          dueDate: "2023-04-22",
          returnDate: "2023-04-20",
          status: "returned",
          isOverdue: false,
        },
        {
          id: 102,
          item: {
            id: 5,
            title: "The Hobbit",
            creator: "J.R.R. Tolkien",
            type: "audiobook",
            coverUrl: "/placeholder.svg?height=60&width=40",
          },
          borrower: {
            id: 102,
            name: "Sarah Johnson",
            email: "sarah@example.com",
          },
          borrowDate: "2023-03-15",
          dueDate: "2023-03-29",
          returnDate: "2023-04-05",
          status: "returned",
          isOverdue: true,
        },
      ]

      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status !== "all") {
          history = history.filter((item) => item.status === filters.status)
        }

        if (filters.userId) {
          history = history.filter((item) => item.borrower.id === filters.userId)
        }

        if (filters.fromDate) {
          const fromDate = new Date(filters.fromDate)
          history = history.filter((item) => new Date(item.borrowDate) >= fromDate)
        }

        if (filters.toDate) {
          const toDate = new Date(filters.toDate)
          history = history.filter((item) => new Date(item.borrowDate) <= toDate)
        }
      }

      return { data: history }
    }

    // Real API call
    return api.get("/borrows/history", { params: filters })
  },
}

// API endpoints for fines management
export const finesAPI = {
  // Get all fines - librarian only
  getAllFines: async (filters?: any) => {
    /* 
// Request Format: Query parameters
// Example: /fines?status=unpaid
// Response Format:
{
  "data": [
    {
      "id": 1,
      "borrower": {
        "id": 102,
        "name": "Sarah Johnson",
        "email": "sarah@example.com",
        "hasOverdue": true
      },
      "item": {
        "id": 3,
        "title": "1984",
        "creator": "George Orwell",
        "type": "book",
        "coverUrl": "/path/to/cover.jpg"
      },
      "dueDate": "2023-05-15T10:00:00Z",
      "returnDate": "2023-05-25T14:20:00Z",
      "daysLate": 10,
      "amount": 2.50,
      "status": "unpaid"
    },
    // More fines...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let fines = [...dummyData.fines]

      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status !== "all") {
          fines = fines.filter((fine) => fine.status === filters.status)
        }

        if (filters.userId) {
          fines = fines.filter((fine) => fine.borrower.id === filters.userId)
        }
      }

      return { data: fines }
    }

    // Real API call
    return api.get("/fines", { params: filters })
  },

  // Get fine by ID - works for both librarian and borrower
  getFineById: async (fineId: number) => {
    /* 
// Request Format: No body, just the fineId in URL
// Response Format:
{
  "data": {
    "id": 1,
    "borrower": {
      "id": 102,
      "name": "Sarah Johnson",
      "email": "sarah@example.com"
    },
    "item": {
      "id": 3,
      "title": "1984",
      "creator": "George Orwell",
      "type": "book",
      "coverUrl": "/path/to/cover.jpg"
    },
    "dueDate": "2023-05-15T10:00:00Z",
    "returnDate": "2023-05-25T14:20:00Z",
    "daysLate": 10,
    "amount": 2.50,
    "status": "unpaid",
    "createdAt": "2023-05-25T14:20:00Z"
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const fine = dummyData.fines.find((fine) => fine.id === fineId)
      if (!fine) {
        throw new Error("Fine not found")
      }

      return { data: fine }
    }

    // Real API call
    return api.get(`/fines/${fineId}`)
  },

  // Get user fines - borrower only
  getUserFines: async (userId: number) => {
    /* 
// Request Format: No body, just the userId in URL
// Response Format:
{
  "data": [
    {
      "id": 1,
      "item": {
        "id": 3,
        "title": "1984",
        "creator": "George Orwell",
        "type": "book",
        "coverUrl": "/path/to/cover.jpg"
      },
      "dueDate": "2023-05-15T10:00:00Z",
      "returnDate": "2023-05-25T14:20:00Z",
      "daysLate": 10,
      "amount": 2.50,
      "status": "unpaid"
    },
    // More fines for this user...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const userFines = dummyData.fines.filter((fine) => fine.borrower.id === userId)
      return { data: userFines }
    }

    // Real API call
    return api.get(`/fines/user/${userId}`)
  },

  // Pay fine - borrower only
  payFine: async (fineId: number, paymentData: any) => {
    /* 
// Request Format:
{
  "method": "Credit Card",
  "cardNumber": "4242424242424242",
  "cardExpiry": "12/25",
  "cardCvc": "123",
  "amount": 2.50
}
// Response Format:
{
  "data": {
    "fine": {
      "id": 1,
      "status": "paid",
      "paidDate": "2023-06-10T11:30:00Z",
      "paymentMethod": "Credit Card",
      "transactionId": "TXN123456"
    },
    "payment": {
      "id": "PMT123456",
      "date": "2023-06-10T11:30:00Z",
      "borrower": {
        "id": 102,
        "name": "Sarah Johnson"
      },
      "items": [
        {
          "id": 3,
          "title": "1984",
          "type": "book"
        }
      ],
      "amount": 2.50,
      "method": "Credit Card",
      "cardLast4": "4242",
      "status": "completed",
      "transactionId": "TXN123456"
    }
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const fine = dummyData.fines.find((fine) => fine.id === fineId)
      if (!fine) {
        throw new Error("Fine not found")
      }

      // Update fine status
      const updatedFine = {
        ...fine,
        status: "paid",
        paidDate: new Date().toISOString(),
        paymentMethod: paymentData.method,
        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
      }

      // Create payment record
      const payment = {
        id: `PMT${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        borrower: fine.borrower,
        items: [fine.item],
        amount: fine.amount,
        method: paymentData.method,
        cardLast4: paymentData.method === "Credit Card" ? paymentData.cardLast4 || "4242" : undefined,
        status: "completed",
        transactionId: updatedFine.transactionId,
        processedBy: "System (Online)",
      }

      // In a real app, this would update the database
      return { data: { fine: updatedFine, payment } }
    }

    // Real API call
    return api.post(`/fines/${fineId}/pay`, paymentData)
  },

  // Waive fine - librarian only
  waiveFine: async (fineId: number, reason: string) => {
    /* 
// Request Format:
{
  "reason": "Administrative decision"
}
// Response Format:
{
  "data": {
    "fine": {
      "id": 2,
      "status": "paid",
      "paidDate": "2023-06-10T11:45:00Z",
      "paymentMethod": "Waived",
      "transactionId": "TXN789012",
      "waiveReason": "Administrative decision"
    },
    "payment": {
      "id": "PMT789012",
      "date": "2023-06-10T11:45:00Z",
      "borrower": {
        "id": 103,
        "name": "Jane Smith"
      },
      "items": [
        {
          "id": 4,
          "title": "Pride and Prejudice",
          "type": "book"
        }
      ],
      "amount": 1.75,
      "method": "Waived",
      "status": "waived",
      "transactionId": "TXN789012",
      "processedBy": "Admin (Manual)",
      "reason": "Administrative decision"
    }
  }
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const fine = dummyData.fines.find((fine) => fine.id === fineId)
      if (!fine) {
        throw new Error("Fine not found")
      }

      // Update fine status
      const updatedFine = {
        ...fine,
        status: "paid",
        paidDate: new Date().toISOString(),
        paymentMethod: "Waived",
        transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
        waiveReason: reason,
      }

      // Create payment record
      const payment = {
        id: `PMT${Math.floor(Math.random() * 1000000)}`,
        date: new Date().toISOString(),
        borrower: fine.borrower,
        items: [fine.item],
        amount: fine.amount,
        method: "Waived",
        status: "waived",
        transactionId: updatedFine.transactionId,
        processedBy: "Admin (Manual)",
        reason,
      }

      // In a real app, this would update the database
      return { data: { fine: updatedFine, payment } }
    }

    // Real API call
    return api.put(`/fines/${fineId}/waive`, { reason })
  },

  // Get payment history - librarian only
  getPaymentHistory: async (filters?: any) => {
    /* 
// Request Format: Query parameters
// Example: /fines/payments?period=month&method=Credit%20Card&userId=102
// Response Format:
{
  "data": [
    {
      "id": "PMT123456",
      "date": "2023-06-10T11:30:00Z",
      "borrower": {
        "id": 102,
        "name": "Sarah Johnson",
        "email": "sarah@example.com"
      },
      "items": [
        {
          "id": 3,
          "title": "1984",
          "type": "book"
        }
      ],
      "amount": 2.50,
      "method": "Credit Card",
      "cardLast4": "4242",
      "status": "completed",
      "transactionId": "TXN123456",
      "processedBy": "System (Online)"
    },
    // More payment history items...
  ]
}
*/
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let payments = [...dummyData.paymentHistory]

      // Apply filters if provided
      if (filters) {
        if (filters.period) {
          const now = new Date()
          const cutoffDate = new Date()

          if (filters.period === "today") {
            cutoffDate.setHours(0, 0, 0, 0)
          } else if (filters.period === "week") {
            cutoffDate.setDate(now.getDate() - 7)
          } else if (filters.period === "month") {
            cutoffDate.setMonth(now.getMonth() - 1)
          }

          payments = payments.filter((payment) => new Date(payment.date) >= cutoffDate)
        }

        if (filters.method && filters.method !== "all") {
          payments = payments.filter((payment) => payment.method.toLowerCase() === filters.method.toLowerCase())
        }

        if (filters.userId) {
          payments = payments.filter((payment) => payment.borrower.id === filters.userId)
        }
      }

      return { data: payments }
    }

    // Real API call
    return api.get("/fines/payments", { params: filters })
  },
}

// API endpoints for content requests
export const requestAPI = {
  // Submit content request - borrower only
  submitContentRequest: async (requestData: any) => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      // Create new content request
      const newRequest = {
        id: dummyData.contentRequests.length + 1,
        ...requestData,
        requestDate: new Date().toISOString(),
        status: "pending",
      }

      // In a real app, this would add to the database
      return { data: newRequest }
    }

    // Real API call
    return api.post("/requests", requestData)
  },

  // Get content requests - librarian only
  getContentRequests: async (filters?: any) => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      let requests = [...dummyData.contentRequests]

      // Apply filters if provided
      if (filters) {
        if (filters.status && filters.status !== "all") {
          requests = requests.filter((request) => request.status === filters.status)
        }

        if (filters.userId) {
          requests = requests.filter((request) => request.userId === filters.userId)
        }
      }

      return { data: requests }
    }

    // Real API call
    return api.get("/requests", { params: filters })
  },

  // Get user's content requests - borrower only
  getUserRequests: async (userId: number) => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const userRequests = dummyData.contentRequests.filter((request) => request.userId === userId)
      return { data: userRequests }
    }

    // Real API call
    return api.get(`/requests/user/${userId}`)
  },

  // Approve content request - librarian only
  approveContentRequest: async (requestId: number, notes?: string) => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const request = dummyData.contentRequests.find((req) => req.id === requestId)
      if (!request) {
        throw new Error("Content request not found")
      }

      // Update request status
      const updatedRequest = {
        ...request,
        status: "approved",
        approvalDate: new Date().toISOString(),
        approvalNotes: notes || "Your request has been approved. The item will be added to our collection soon.",
      }

      // In a real app, this would update the database
      return { data: updatedRequest }
    }

    // Real API call
    return api.put(`/requests/${requestId}/approve`, { notes })
  },

  // Decline content request - librarian only
  declineContentRequest: async (requestId: number, reason: string) => {
    if (USE_DUMMY_DATA) {
      // Simulate API delay
      await simulateApiDelay()

      const request = dummyData.contentRequests.find((req) => req.id === requestId)
      if (!request) {
        throw new Error("Content request not found")
      }

      // Update request status
      const updatedRequest = {
        ...request,
        status: "declined",
        declineDate: new Date().toISOString(),
        declineReason: reason || "We are unable to fulfill this request at this time.",
      }

      // In a real app, this would update the database
      return { data: updatedRequest }
    }

    // Real API call
    return api.put(`/requests/${requestId}/decline`, { reason })
  },
}

export default api

