// app/dashboard/borrower/returns/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Check, User, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { borrowAPI } from "@/lib/api/borrow";

type ReviewRecord = {
  reviewId: number;
  borrowId: number;
  itemDescriptionId: number;
  rating: number;
  comment: string;
};

type ModalState = null | {
  borrowId: number;
  itemId: number;
  reviewId?: number; // only if editing
  rating: number;
  comment: string;
};

export default function BorrowerReturnsPage() {
  const { toast } = useToast();
  const [borrowedItems, setBorrowedItems] = useState<any[]>([]);
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [returningItems, setReturningItems] = useState<number[]>([]);
  const [returnedItems, setReturnedItems] = useState<number[]>([]);
  const [showSuccessPopup, setShowSuccessPopup] = useState<{ name: string; imageUrl: string } | null>(null);
  const [modalBorrow, setModalBorrow] = useState<ModalState>(null);

  // Fetch borrows + reviews
  const loadData = async () => {
    setIsLoading(true);
    toast({ title: "API Request", description: "Loading borrows + reviews…", variant: "default" });
    try {
      const items = await borrowAPI.getBorrowedItems();
      const revs = await borrowAPI.getMyReviews();
      setBorrowedItems(items);
      setReviews(revs);
      toast({
        title: "API Success",
        description: `Loaded ${items.length} borrows & ${revs.length} reviews`,
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "API Error",
        description: `Could not load data: ${err instanceof Error ? err.message : err}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Return handler
  const handleReturnItem = async (borrowId: number) => {
    setReturningItems((p) => [...p, borrowId]);
    toast({ title: "API Request", description: `Returning item ${borrowId}…`, variant: "default" });
    try {
      await borrowAPI.returnItem(borrowId);
      const returned = borrowedItems.find((b) => b.id === borrowId);
      if (returned) {
        setShowSuccessPopup({
          name: returned.item.description.itemName,
          imageUrl: returned.item.description.imageUrl,
        });
        setTimeout(() => setShowSuccessPopup(null), 5000);
      }
      setReturnedItems((p) => [...p, borrowId]);
      toast({ title: "API Success", description: "Item returned", variant: "success" });
    } catch (err) {
      console.error(err);
      toast({
        title: "API Error",
        description: `Failed to return: ${err instanceof Error ? err.message : err}`,
        variant: "destructive",
      });
    } finally {
      setReturningItems((p) => p.filter((id) => id !== borrowId));
    }
  };

  // split active vs finished
  const activeItems = borrowedItems.filter((i) => i.status !== "RETURNED" && !returnedItems.includes(i.id));
  const finishedItems = borrowedItems.filter(
    (i) => i.status === "RETURNED" || returnedItems.includes(i.id)
  );

  // group by descriptionId
  const returnedGroups = finishedItems.reduce((acc, item) => {
    const descId = item.item.description.descriptionId;
    if (!acc[descId]) {
      acc[descId] = { description: item.item.description, items: [] as any[] };
    }
    acc[descId].items.push(item);
    return acc;
  }, {} as Record<number, { description: any; items: any[] }>);

  // turn into array for mapping
  const returnedGroupsArray = Object.entries(returnedGroups).map(([descId, group]) => ({
    descId: Number(descId),
    description: group.description,
    items: group.items,
  }));

  return (
    <div className="min-h-screen bg-gray-100 relative">
      {/* HEADER */}
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/borrower" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="flex items-center gap-2 bg-white p-2 rounded-full border border-gray-200">
              <User className="h-5 w-5 text-[#39FF14]" />
              <span className="text-gray-800 font-medium">John Doe</span>
            </div>
            <Link href="/auth" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
              <LogOut className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed top-6 right-6 z-50 bg-white border border-[#39FF14] p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in-out">
          <img
            src={showSuccessPopup.imageUrl}
            onError={(e) => {
              const t = e.currentTarget;
              t.onerror = null;
              t.src = "https://placehold.co/300x300?text=No+Image&font=roboto";
            }}
            alt="Item cover"
            className="h-12 w-10 object-cover rounded"
          />
          <div>
            <p className="font-bold text-gray-800">Returned!</p>
            <p className="text-sm text-gray-600">{showSuccessPopup.name}</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* ACTIVE ITEMS */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#39FF14]" />
          </div>
        ) : activeItems.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center">
            <Check className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">All Items Returned</h2>
            <p className="text-gray-600 mb-6">You have no items to return right now.</p>
            <Link
              href="/dashboard/borrower"
              className="inline-flex rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90 focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-4 mb-8">
            {activeItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-[#39FF14]/30 shadow-sm overflow-hidden"
              >
                <div className="p-4 flex items-center gap-4">
                <img
                        src={item.item.description.imageUrl}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src =
                          item.item.description.type === "BOOK"
                              ? "https://placehold.co/300x300?text=Book&font=roboto"
                              : item.type === "AUDIOBOOK"
                              ? "https://placehold.co/300x300?text=Audiobook&font=roboto"
                              : item.type === "DVD"
                              ? "https://placehold.co/300x300?text=DVD&font=roboto"
                              : "https://placehold.co/300x300?text=Other&font=roboto"
                        }}
                        alt={item.item.description.itemName}
                        className="h-20 w-16 object-cover rounded"
                      />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.item.description.itemName}</h3>
                    <p className="text-sm text-gray-600">
                      {(item.item.description.type === "book" || item.item.description.type === "audiobook"
                        ? "Author"
                        : "Director")}
                      : {item.item.description.authorName || item.item.description.director}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReturnItem(item.id)}
                    disabled={returningItems.includes(item.id)}
                    className="inline-flex items-center gap-2 rounded-md bg-[#39FF14] px-4 py-2 text-sm font-medium text-black shadow hover:bg-[#39FF14]/90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#39FF14]"
                  >
                    {returningItems.includes(item.id) ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black" /> Returning...</>
                    ) : (
                      "Return Item"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RETURNED (grouped) + REVIEW */}
        {returnedGroupsArray.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Returned Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {returnedGroupsArray.map(({ descId, description, items }) => {
                // one review per description
                const myReview = reviews.find((r) => r.itemDescriptionId === descId);
                const exampleBorrow = items[0];
                return (
                  <div
                    key={descId}
                    className="bg-gray-100 rounded-lg border border-gray-300 shadow-sm overflow-hidden"
                  >
                    <div className="p-4 flex items-start gap-4">
                      <img
                        src={description.imageUrl}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src =
                          description.type === "BOOK"
                              ? "https://placehold.co/300x300?text=Book&font=roboto"
                              : description.type === "AUDIOBOOK"
                              ? "https://placehold.co/300x300?text=Audiobook&font=roboto"
                              : description.type === "DVD"
                              ? "https://placehold.co/300x300?text=DVD&font=roboto"
                              : "https://placehold.co/300x300?text=Other&font=roboto"
                        }}
                        alt={description.itemName}
                        className="h-20 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{description.itemName}</h3>
                        <p className="text-xs text-gray-500 mb-2">
                          {items.length} return{items.length > 1 ? "s" : ""}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          Returned on:{" "}
                          {items
                            .map((it) => new Date(it.returnedOn).toLocaleDateString())
                            .join(", ")}
                        </p>

                        {myReview ? (
                          <button
                            className="text-blue-600 text-sm"
                            onClick={() =>
                              setModalBorrow({
                                borrowId: exampleBorrow.id,
                                itemId: exampleBorrow.item.itemId,
                                reviewId: myReview.reviewId,
                                rating: myReview.rating,
                                comment: myReview.comment,
                              })
                            }
                          >
                            Edit / Delete Review
                          </button>
                        ) : (
                          <button
                            className="text-green-600 text-sm"
                            onClick={() =>
                              setModalBorrow({
                                borrowId: exampleBorrow.id,
                                itemId: exampleBorrow.item.itemId,
                                rating: 5,
                                comment: "",
                              })
                            }
                          >
                            Add Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* REVIEW MODAL */}
      {modalBorrow && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {modalBorrow.reviewId != null ? "Edit Review" : "Add Review"}
            </h2>

            {/* Rating */}
            <label className="block mb-2">Rating (1–5):</label>
            <input
              type="number"
              min={1}
              max={5}
              value={modalBorrow.rating}
              onChange={(e) =>
                setModalBorrow((m) => m && ({ ...m, rating: parseInt(e.target.value) || 1 }))
              }
              className="border p-2 rounded w-full mb-4"
            />

            {/* Comment */}
            <label className="block mb-2">Comment:</label>
            <textarea
              rows={4}
              value={modalBorrow.comment}
              onChange={(e) =>
                setModalBorrow((m) => m && ({ ...m, comment: e.target.value }))
              }
              className="border p-2 rounded w-full mb-4"
            />

            <div className="flex justify-end gap-2">
              {modalBorrow.reviewId != null && (
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={async () => {
                    await borrowAPI.deleteReview(modalBorrow.reviewId!);
                    await loadData();
                    setModalBorrow(null);
                  }}
                >
                  Delete
                </button>
              )}
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setModalBorrow(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={async () => {
                  if (modalBorrow.reviewId != null) {
                    await borrowAPI.updateReview(
                      modalBorrow.reviewId,
                      modalBorrow.rating,
                      modalBorrow.comment
                    );
                  } else {
                    await borrowAPI.addReview(
                      modalBorrow.borrowId,
                      modalBorrow.itemId,
                      modalBorrow.rating,
                      modalBorrow.comment
                    );
                  }
                  await loadData();
                  setModalBorrow(null);
                }}
              >
                {modalBorrow.reviewId != null ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
