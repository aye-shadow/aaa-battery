// lib/api/fines.ts
// Fines management API endpoints

import api from "./axios-instance"

// API endpoints for fines management
export const finesAPI = {
  // Get all fines - librarian only
  getAllFines: async (filters?: any) => {
    return api.get("/fines", { params: filters })
  },

  // Get fine by ID - works for both librarian and borrower
  getFineById: async (fineId: number) => {
    return api.get(`/fines/${fineId}`)
  },

  // Get user fines - borrower only
  getUserFines: async (userId: number) => {
    return api.get(`/fines/user/${userId}`)
  },

  // Pay fine - borrower only
  payFine: async (fineId: number, paymentData: any) => {
    return api.post(`/fines/${fineId}/pay`, paymentData)
  },

  // Waive fine - librarian only
  waiveFine: async (fineId: number, reason: string) => {
    return api.put(`/fines/${fineId}/waive`, { reason })
  },

  // Get payment history - librarian only
  getPaymentHistory: async (filters?: any) => {
    return api.get("/fines/payments", { params: filters })
  },
}

export default finesAPI
