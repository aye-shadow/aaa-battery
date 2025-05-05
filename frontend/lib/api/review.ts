import api from "./axios-instance";
import { API_BASE_URL } from "./axios-instance";

export const reviewAPI = {
  // View all reviews by a borrower
  getMyReviews: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/borrower/my-reviews`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error fetching reviews:", errorText);
        throw new Error("Failed to fetch reviews");
      }

      const data = await res.json();
      console.log("Fetched reviews:", data);
      return data;
    } catch (error) {
      console.error("Error in getMyReviews:", error instanceof Error ? error.message : error);
      throw error; // Re-throw the error to allow the caller to handle it as well
    }
  },

  // Add a new review
  addReview: async (reviewData: { borrowId: number, itemId: number, rating: number, comment: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/borrower/new-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error adding review:", errorText);
        throw new Error("Failed to submit review");
      }

      const responseData = await res.json();
      console.log("Review added successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error in addReview:", error instanceof Error ? error.message : error);
      throw error;
    }
  },

  // Update an existing review
  updateReview: async (reviewId: number, reviewData: { rating: number, comment: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/borrower/update-review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(reviewData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error updating review:", errorText);
        throw new Error("Failed to update review");
      }

      const responseData = await res.json();
      console.log("Review updated successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error in updateReview:", error instanceof Error ? error.message : error);
      throw error;
    }
  },

  // Delete a review
  deleteReview: async (reviewId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/borrower/delete-review/${reviewId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error deleting review:", errorText);
        throw new Error("Failed to delete review");
      }

      const responseData = await res.json();
      console.log("Review deleted successfully:", responseData);
      return responseData;
    } catch (error) {
      console.error("Error in deleteReview:", error instanceof Error ? error.message : error);
      throw error;
    }
  },
};

export default reviewAPI;
