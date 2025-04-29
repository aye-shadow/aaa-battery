// lib/api/fines.ts
import { API_BASE_URL } from "./axios-instance"

export const finesAPI = {
  /** Fetch all fines for the current borrower */
  getMyFines: async () => {
    const res = await fetch(
      `${API_BASE_URL}/fines/borrower/my-fines`,
      { method: "GET", credentials: "include" }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error("❌ Failed to fetch fines:", text)
      throw new Error(`Failed to fetch fines: ${text}`)
    }
    return await res.json()  // returns array of { fineId, amount, paid, issuedDate, itemId, itemName, borrowDate, returnDate, daysLate }
  },

  getAllFines: async (params: any) => {
    // Convert params object to query string
    const queryString = new URLSearchParams(params).toString();
  
    const res = await fetch(
      `${API_BASE_URL}/fines/librarian/view-fines?${queryString}`, // Append query string to the URL
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensure credentials are sent with the request
      }
    );
    const resj=await res.json()
    console.log(await resj)
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Failed to fetch fines:", text);
      throw new Error(`Failed to fetch fines: ${text}`);
    }

    return resj; // Return the response as JSON
  },
  

  /** Pay a single fine */
  payFine: async (fineId: number, paymentData: any) => {
    const res = await fetch(
      `${API_BASE_URL}/fines/${fineId}/pay`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(paymentData),
      }
    )
    if (!res.ok) {
      const text = await res.text()
      console.error("❌ Failed to pay fine:", text)
      throw new Error(`Failed to pay fine: ${text}`)
    }
    return await res.json()
  },

  /** Existing: fetch payment history */
  getPaymentHistory: async (params: any) => {
    // your existing implementation...
  },
}
