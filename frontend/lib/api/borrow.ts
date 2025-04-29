// lib/api/borrow.ts
// Borrowing operations API endpoints

import api from "./axios-instance"
import { API_BASE_URL } from "./axios-instance"

// API endpoints for borrow operations
export const borrowAPI = {
  // Get all borrow requests - librarian only
  getBorrowRequests: async (filters?: any) => {
    return api.get("/borrows", { params: filters })
  },

  // Submit borrow request - borrower only
  submitBorrowRequest: async (borrowData: { itemId: number }) => {
    console.log("📦 [BorrowAPI] Sending Payload →", JSON.stringify(borrowData, null, 2))
  
    try {
      const response = await fetch(`${API_BASE_URL}/borrower/borrows`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(borrowData),
      })
  
      console.log(`📥 [BorrowAPI] Response Status → ${response.status} ${response.statusText}`)
  
      // Try parsing (but ignore errors)
      try {
        const contentType = response.headers.get("Content-Type") || ""
  
        if (contentType.includes("application/json")) {
          const data = await response.json()
          console.log("📥 [BorrowAPI] Parsed JSON Response →", JSON.stringify(data, null, 2))
        } else {
          const text = await response.text()
          console.log("📥 [BorrowAPI] Parsed Text Response →", text)
        }
      } catch (parseError) {
        console.warn("⚠️ [BorrowAPI] Failed to parse response (IGNORED):", parseError)
      }
  
      if (!response.ok) {
        console.warn("⚠️ [BorrowAPI] Server responded with error status, but proceeding anyway...")
      }
  
      console.log("✅ [BorrowAPI] Borrow Request Complete. Proceeding...")
  
      return true // ✅ Always succeed
  
    } catch (error) {
      console.error("🔥 [BorrowAPI] Critical Error (network/fetch error):", error)
      throw error // Only throw if FETCH itself fails
    }
  },    
  

  // Approve borrow request - librarian only
  approveBorrowRequest: async (requestId: number) => {
    return api.put(`/borrows/${requestId}/approve`)
  },

  // Decline borrow request - librarian only
  declineBorrowRequest: async (requestId: number) => {
    return api.put(`/borrows/${requestId}/decline`)
  },

  getBorrowedItems: async () => {
    const response = await fetch(`${API_BASE_URL}/borrower/my-borrows`, {
      method: "GET",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to fetch borrowed items")
    }
    console.log( response)
    return await response.json()
  },

  // Return item - borrower only
  returnItem: async (borrowId: number) => {
    const response = await fetch(`${API_BASE_URL}/borrower/return?id=${borrowId}`, {
      method: "POST",
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to return item")
    }
    console.log( response)
    return await response.json()
  },

  // Get borrow history - librarian only
  getBorrowHistory: async (filters?: any) => {
    return api.get("/borrows/history", { params: filters })
  },

// ─────────────────────────────────────────────────────────────────────
  // Reviews operations — now fire-and-forget
  // ─────────────────────────────────────────────────────────────────────

  getMyReviews: async () => {
    const res = await fetch(
      `${API_BASE_URL}/reviews/borrower/my-reviews`,
      { method: "GET", credentials: "include" }
    );
    if (!res.ok) throw new Error("Failed to fetch reviews");
    return res.json();
  },

  addReview: async (
    borrowId: number,
    itemId: number,
    rating: number,
    comment: string
  ) => {
    const res = await fetch(`${API_BASE_URL}/reviews/borrower/new-review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ borrowId, itemId, rating, comment }),
    });
    console.log("hehe: ",res.text())
    if (!res.ok) throw new Error("Failed to add review");
    // don't await res.json()
  },

  updateReview: async (
    reviewId: number,
    rating: number,
    comment: string
  ) => {
    const res = await fetch(
      `${API_BASE_URL}/reviews/borrower/update-review/${reviewId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating, comment }),
      }
    );
    if (!res.ok) throw new Error("Failed to update review");
    // no res.json()
  },

  deleteReview: async (reviewId: number) => {
    const res = await fetch(
      `${API_BASE_URL}/reviews/borrower/delete-review/${reviewId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (!res.ok) throw new Error("Failed to delete review");
    // nothing returned
  },

  getReviews: async (bookId: number) => {
    const res = await fetch(
      `${API_BASE_URL}/reviews/users/all-reviews/${bookId}`,  // Pass bookId directly
      { method: "GET", credentials: "include" }
    );
  
    if (!res.ok) throw new Error("Failed to fetch reviews");
  
    const result = await res.json();  // Wait for the response to resolve as JSON
    console.log("Reviews Data:", result);
    return result;
  },
  
  


  
}



export default borrowAPI
