// lib/api/request.ts
// Content requests API endpoints

import api from "./axios-instance"
import { API_BASE_URL } from "./axios-instance"

// API endpoints for content requests


export const requestAPI = {
  submitContentRequest: async (requestData: any) => {
    const itemType = (requestData?.itemType || "book").toLowerCase();
    const itemName = requestData?.itemName || "";
    const itemBy = requestData?.itemBy || "";
    const notes = requestData?.notes || "";

    const res = await fetch(`${API_BASE_URL}/request/borrower/new-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        itemType,
        itemName,
        itemBy,
        notes,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to submit request");
    }

    const responseData = await res.text();
    console.log("✅ Submit Response:", responseData);

    return responseData;
  },
  
  getContentRequests: async () => {
    const res = await fetch(`${API_BASE_URL}/request/librarian/view-requests`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(errorText || "Failed to fetch content requests");
    }

    const data = await res.json();
    return data;
  },

  // Get user's content requests - borrower only
  getUserRequests: async (userId: number) => {
    return api.get(`/requests/user/${userId}`)
  },

  // Approve content request - librarian only
  approveContentRequest: async (requestId: number, notes?: string) => {
    return api.put(`/requests/${requestId}/approve`, { notes })
  },

  // Decline content request - librarian only
  declineContentRequest: async (requestId: number, reason: string) => {
    return api.put(`/requests/${requestId}/decline`, { reason })
  },
}

export default requestAPI
