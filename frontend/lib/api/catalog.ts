// lib/api/catalog.ts
import api from "./axios-instance"
import { API_BASE_URL } from "./axios-instance"

export const catalogAPI = {
  getAllItems: async () => {
    const response = await fetch(`${API_BASE_URL}/items/users/view-items`)
    if (!response.ok) {
      throw new Error("Failed to fetch catalog items")
    }
    const data = await response.json()

    return data.map((item: any) => {
      const desc = item.description
      return {
        id: desc.descriptionId,
        title: desc.itemName,
        creator: desc.authorName || desc.director || desc.narratorName || "Unknown",
        genre: desc.genre,
        publisher: desc.publisher || desc.producer || "Unknown",
        type: desc.type,
        year: desc.date ? desc.date[0] : "Unknown",
        coverUrl: desc.imageUrl,
        description: desc.blurb,
        available: item.availability,
        totalCopies: desc.totalCopies,
        availableCopies: undefined,
        duration: desc.duration || null,
      }
    })
  },

  searchItems: async (query: string) => {
    const response = await fetch(`${API_BASE_URL}/items/users/view-items`)
    if (!response.ok) {
      throw new Error("Failed to fetch catalog search items")
    }
    const data = await response.json()

    const mapped = data.map((item: any) => {
      const desc = item.description
      return {
        id: desc.descriptionId,
        title: desc.itemName,
        creator: desc.authorName || desc.director || desc.narratorName || "Unknown",
        genre: desc.genre,
        publisher: desc.publisher || desc.producer || "Unknown",
        type: desc.type,
        year: desc.date ? desc.date[0] : "Unknown",
        coverUrl: desc.imageUrl,
        description: desc.blurb,
        available: item.availability,
        totalCopies: desc.totalCopies,
        availableCopies: undefined,
        duration: desc.duration || null,
      }
    })

    return mapped.filter((item: any) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.creator.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    )
  },

  // ✅ Correct individual item fetch + availableCopies counting
  getItemById: async (type: string, id: number) => {
    const response = await fetch(`${API_BASE_URL}/items/users/view-item?descriptionId=${id}`)
    if (!response.ok) {
      throw new Error("Failed to fetch individual catalog item")
    }
    const data = await response.json()

    if (!data || data.length === 0) {
      return null
    }

    const desc = data[0].description

    const availableCopies = data.filter((item: any) => item.availability === true).length
    const totalCopies = data.length
    const isAvailable = availableCopies > 0

    return {
      id: desc.descriptionId,
      title: desc.itemName,
      creator: desc.authorName || desc.director || desc.narratorName || "Unknown",
      genre: desc.genre,
      publisher: desc.publisher || desc.producer || "Unknown",
      type: desc.type,
      year: desc.date ? desc.date[0] : "Unknown",
      coverUrl: desc.imageUrl,
      description: desc.blurb,
      available: isAvailable,
      totalCopies: totalCopies,
      availableCopies: availableCopies,
      duration: desc.duration || null,
    }
  },
  addItem: async (formData: any) => {
    const payload: any = {
      type: formData.type,
      itemName: formData.itemName,
      genre: formData.genre,
      blurb: formData.blurb,
      date: formData.date ? `${formData.date}T00:00:00` : "",
      totalCopies: Number(formData.totalCopies),
      imageUrl: formData.imageUrl,
    }
  
    if (formData.type === "book") {
      payload.authorName = formData.authorName
    } else if (formData.type === "audiobook") {
      payload.narratorName = formData.narratorName
      payload.duration = formData.duration
    } else if (formData.type === "dvd") {
      payload.director = formData.director
      payload.producer = formData.producer
      payload.duration = formData.duration
    }
  
    console.log("🚀 Payload being sent to server:", payload)
  
    const response = await fetch(`${API_BASE_URL}/items/librarian/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    })
  
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to add item: ${errorText}`)
    }
  
    // ✅ Wait for the server response text
    const text = await response.text()
  
    console.log("✅ Item added successfully:", text)
  
    // ✅ Don't throw, just return the success text
    return text
  },
  

  updateItem: async (itemId: number, itemData: any) => {
    return api.put(`/catalog/${itemId}`, itemData)
  },

  deleteItem: async (itemId: number) => {
    return api.delete(`/catalog/${itemId}`)
  },
}

export default catalogAPI
