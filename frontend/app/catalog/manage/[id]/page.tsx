"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import catalogAPI from "@/lib/api/catalog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, ArrowLeft, PlusCircle, Edit, Loader2 } from "lucide-react"

export default function ManageItemPage() {
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()

  const itemId = params?.itemId as string | undefined
  const isEditMode = itemId !== undefined && itemId !== "new"

  const [formData, setFormData] = useState({
    type: "book",
    itemName: "",
    genre: "",
    blurb: "",
    date: "", // Correct! (yyyy-mm-dd)
    totalCopies: 1,
    imageUrl: "",
    authorName: "",
    narratorName: "",
    director: "",
    producer: "",
    duration: "",
  })

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEditMode) {
      const fetchItem = async () => {
        setLoading(true)
        try {
          const item = await catalogAPI.getItemById("book", Number(itemId))
          setFormData({
            type: item.type,
            itemName: item.title,
            genre: item.genre,
            blurb: item.description,
            date: item.year,
            totalCopies: item.totalCopies,
            imageUrl: item.coverUrl,
            authorName: item.creator,
            narratorName: item.creator,
            director: item.creator,
            producer: item.publisher,
            duration: item.duration || "",
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load item for editing.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
      fetchItem()
    }
  }, [isEditMode, itemId, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, type: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (isEditMode && itemId) {
        await catalogAPI.updateItem(Number(itemId), formData)
        toast({
          title: "Success",
          description: "Item updated successfully!",
          variant: "success",
        })
      } else {
        await catalogAPI.addItem(formData)
        toast({
          title: "Success",
          description: "Item created successfully!",
          variant: "success",
        })
      }
      setTimeout(() => {
        router.push("/catalog")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/catalog" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 shadow-sm border border-[#39FF14]/30">
          <div className="flex items-center gap-3 mb-6">
            {isEditMode ? (
              <Edit className="h-7 w-7 text-[#39FF14]" />
            ) : (
              <PlusCircle className="h-7 w-7 text-[#39FF14]" />
            )}
            <h1 className="text-2xl font-bold text-gray-800">{isEditMode ? "Edit Item" : "Add New Item"}</h1>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Item Type</label>
              <Select onValueChange={handleTypeChange} defaultValue={formData.type}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="audiobook">Audiobook</SelectItem>
                  <SelectItem value="dvd">DVD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Item Name */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Item Name</label>
              <Input name="itemName" value={formData.itemName} onChange={handleChange} />
            </div>

            {/* Genre */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Genre</label>
              <Input name="genre" value={formData.genre} onChange={handleChange} />
            </div>

            {/* Publication Date */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Publication Date</label>
              <Input name="date" type="date" value={formData.date} onChange={handleChange} />
            </div>

            {/* Total Copies */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Total Copies</label>
              <Input name="totalCopies" type="number" value={formData.totalCopies} onChange={handleChange} />
            </div>

            {/* Cover Image URL */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Cover Image URL</label>
              <Input name="imageUrl" value={formData.imageUrl} onChange={handleChange} />
            </div>

            {/* Blurb */}
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-gray-700">Blurb</label>
              <Textarea name="blurb" value={formData.blurb} onChange={handleChange} />
            </div>

            {/* Special Fields Based on Type */}
            {formData.type === "book" && (
              <div className="md:col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-700">Author Name</label>
                <Input name="authorName" value={formData.authorName} onChange={handleChange} />
              </div>
            )}

            {formData.type === "audiobook" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Narrator Name</label>
                  <Input name="narratorName" value={formData.narratorName} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Duration (HH:MM:SS)</label>
                  <Input name="duration" value={formData.duration} onChange={handleChange} />
                </div>
              </>
            )}

            {formData.type === "dvd" && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Director Name</label>
                  <Input name="director" value={formData.director} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Producer Name</label>
                  <Input name="producer" value={formData.producer} onChange={handleChange} />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">Duration (HH:MM:SS)</label>
                  <Input name="duration" value={formData.duration} onChange={handleChange} />
                </div>
              </>
            )}
          </form>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/catalog")}
              className="border border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update Item" : "Create Item"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
