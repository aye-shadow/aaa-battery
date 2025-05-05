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
    console.log("meow")
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
      type: formData.type.toUpperCase(),
      itemName: formData.itemName,
      genre: formData.genre,
      blurb: formData.blurb,
      totalCopies: Number(formData.totalCopies),
      imageUrl: formData.imageUrl,
    };
    // always include date if set
    if (formData.date) {
      payload.date = `${formData.date}T00:00:00`;
    }
    if (formData.type === "book") {
      payload.authorName = formData.authorName;
      payload.publisher  = formData.publisher;
    } else if (formData.type === "audiobook") {
      payload.authorName = formData.authorName;
      payload.publisher  = formData.publisher;
      payload.narrator   = formData.narratorName;
      payload.duration   = formData.duration;
    } else if (formData.type === "dvd") {
      payload.director = formData.director;
      payload.producer = formData.producer;
      payload.duration = formData.duration;
    }
    console.log("📦 [catalogAPI] addItem payload →", payload);
    const response = await fetch(`${API_BASE_URL}/items/librarian/add-item`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to add item: ${errText}`);
    }
    return await response.text();
  },

  updateItem: async (formData: any) => {
    const payload: any = {
      descriptionId: formData.descriptionId,
      type:          formData.type.toUpperCase(),
      itemName:      formData.itemName,
      genre:         formData.genre,
      blurb:         formData.blurb,
      date:          formData.date ? `${formData.date}T00:00:00` : undefined,
      totalCopies:   Number(formData.totalCopies),
      imageUrl:      formData.imageUrl,
    }
    if (formData.type === "book") {
      payload.authorName = formData.authorName
      payload.publisher  = formData.publisher
    } else if (formData.type === "audiobook") {
      payload.authorName = formData.authorName
      payload.publisher  = formData.publisher
      payload.narrator   = formData.narratorName
      payload.duration   = formData.duration
    } else {
      payload.director = formData.director
      payload.producer = formData.producer
      payload.duration = formData.duration
    }

    console.log("🛠 [catalogAPI] updateItem payload →", payload)
    const res = await fetch(`${API_BASE_URL}/items/librarian/edit-item`, {
      method:      "PUT",
      headers:     { "Content-Type": "application/json" },
      credentials: "include",
      body:        JSON.stringify(payload),
    })
    if (!res.ok) {
      const txt = await res.text()
      throw new Error(`Failed to update item: ${txt}`)
    }
    return await res.text()
  },

  updateDescription: async (
    descriptionId: number,
    payload: {
      itemName: string
      blurb: string
      genre: string
      totalCopies: number
      imageUrl?: string
      authorName?: string
      publisher?: string
      narrator?: string
      duration?: string
      director?: string
      producer?: string
    }
  ): Promise<void> => {
    const body = JSON.stringify({ descriptionId, ...payload })
    const res = await fetch(
      `${API_BASE_URL}/items/librarian/edit-item`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body,
      }
    )
    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Update failed: ${err}`)
    }
  },

  getDescriptionById: async (descriptionId: number): Promise<{
    descriptionId: number
    itemType: string
    itemName: string
    genre: string
    blurb: string
    date: number[]
    totalCopies: number
    imageUrl: string
    averageRating?: number
    authorName?: string
    publisher?: string
    narrator?: string
    duration?: string
    director?: string
    producer?: string
  } | null> => {
    const res = await fetch(
      `${API_BASE_URL}/items/users/view-item?descriptionId=${descriptionId}`,
      { credentials: "include" }
    )
    if (!res.ok) {
      console.error("getDescriptionById failed:", await res.text())
      throw new Error("Failed to load description")
    }
    const arr = await res.json()
    console.log("he: ", arr)
    if (!Array.isArray(arr) || arr.length === 0) {
      return null
    }
    // each element has `{ itemId, availability, description: { … } }`
    return arr[0].description
  },
  
}

export default catalogAPI
