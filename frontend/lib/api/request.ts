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

  // Handle (approve / cancel) a single content-request – librarian only
handleContentRequest: async ({
  id,
  status,
  reason = "",
}: {
  id: number;
  status: "APPROVED" | "CANCELLED";
  reason?: string;
}) => {
  if (!id || !status) {
    throw new Error("id and status are required");
  }

  // Make sure the status we send is exactly what the backend expects
  const normalizedStatus =
    status === "APPROVED" ? "APPROVED" : "CANCELLED";

  console.log("📤 Handling request:", { id, normalizedStatus, reason });

  const res = await fetch(
    `${API_BASE_URL}/request/librarian/handle-request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        id,
        status: normalizedStatus,
        reason,
      }),
    }
  );

  // The endpoint returns plain-text on success, but we still check the
  // Content-Type so we can parse JSON if ever added later.
  const contentType = res.headers.get("Content-Type") || "";

  const payload =
    contentType.includes("application/json")
      ? await res.json()
      : await res.text();

  if (!res.ok) {
    console.error("❌ Handle request failed:", payload);
    // The backend’s error message (string or {message}) is bubbled up
    throw new Error(
      typeof payload === "string" ? payload : payload?.message || "Unknown error"
    );
  }

  console.log("✅ Handle request success:", payload);
  return payload; // text or JSON, depending on backend implementation
},


getUserRequests: async () => {
  const res = await fetch(
    `${API_BASE_URL}/request/borrower/my-requests`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  )
  const resj=await res.json()
  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(errorText || "Failed to fetch your requests")
  }
  return resj
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
