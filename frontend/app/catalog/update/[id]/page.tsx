"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Edit, Loader2 } from "lucide-react"
import catalogAPI from "@/lib/api/catalog"
import { useToast } from "@/hooks/use-toast"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

type ItemType = "book" | "audiobook" | "dvd"

interface FormValues {
  descriptionId: number
  type:          ItemType
  itemName:      string
  genre:         string
  blurb:         string
  date:          string
  totalCopies:   number
  imageUrl:      string
  authorName:    string
  publisher:     string
  narrator:      string
  duration:      string
  director:      string
  producer:      string
}

export default function EditItemPage() {
  const { toast } = useToast()
  const router     = useRouter()
  const { id }     = useParams<{ id?: string }>()
  const itemId     = id ? parseInt(id, 10) : NaN
  const valid      = !isNaN(itemId)

  const [form, setForm] = useState<FormValues>({
    descriptionId:  0,
    type:           "book",
    itemName:       "",
    genre:          "",
    blurb:          "",
    date:           "",
    totalCopies:    1,
    imageUrl:       "",
    authorName:     "",
    publisher:      "",
    narrator:       "",
    duration:       "",
    director:       "",
    producer:       "",
  })
  const [loading, setLoading] = useState(false)

  // ─── Load existing description ───────────────────────────────────────────────
  useEffect(() => {
    if (!valid) return
    setLoading(true)

    catalogAPI.getDescriptionById(itemId)
      .then(desc => {
        if (!desc) throw new Error("Not found")
        // format date array [YYYY, M, D, ...] to "YYYY-MM-DD"
        const [Y, M, D] = desc.date
        setForm({
          descriptionId: desc.descriptionId,
          type:          desc.itemType.toLowerCase() as ItemType,
          itemName:      desc.itemName,
          genre:         desc.genre,
          blurb:         desc.blurb,
          date:          `${Y}-${String(M).padStart(2,"0")}-${String(D).padStart(2,"0")}`,
          totalCopies:   desc.totalCopies,
          imageUrl:      desc.imageUrl,
          authorName:    desc.authorName || "",
          publisher:     desc.publisher || "",
          narrator:      desc.narrator  || "",
          duration:      desc.duration  || "",
          director:      desc.director  || "",
          producer:      desc.producer  || "",
        })
      })
      .catch(() =>
        toast({
          title:       "Error",
          description: "Unable to load item.",
          variant:     "destructive",
        })
      )
      .finally(() => setLoading(false))
  }, [itemId, valid, toast])

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(f => ({
      ...f,
      [name]: name === "totalCopies" ? Number(value) : value,
    }))
  }
  const onTypeChange = (val: string) =>
    setForm(f => ({ ...f, type: val as ItemType }))

  const onSave = async () => {
    if (!valid) return
    setLoading(true)

    // build payload exactly as your API expects
    const payload: any = {
      descriptionId: form.descriptionId,
      type:          form.type.toUpperCase(),
      itemName:      form.itemName,
      genre:         form.genre,
      blurb:         form.blurb,
      date:          `${form.date}`,
      totalCopies:   form.totalCopies,
      imageUrl:      form.imageUrl || undefined,
    }
    if (form.type === "book") {
      payload.authorName = form.authorName
      payload.publisher  = form.publisher
    } else if (form.type === "audiobook") {
      payload.authorName = form.authorName
      payload.publisher  = form.publisher
      payload.narrator   = form.narrator
      payload.duration   = form.duration
    } else {
      payload.director = form.director
      payload.producer = form.producer
      payload.duration = form.duration
    }

    try {
      await catalogAPI.updateItem(payload)
      toast({ title: "Saved", description: "Item updated!", variant: "success" })
      router.push("/catalog")
    } catch (err) {
      toast({ title: "Error", description: (err as Error).message, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-[#39FF14]/30 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-[#39FF14]" />
            <span className="text-xl font-bold text-gray-800">LibraryPro</span>
          </div>
          <Link href="/catalog" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-5 w-5" /> Back to Catalog
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm border border-[#39FF14]/30">
          <div className="flex items-center gap-3 mb-6">
            <Edit className="h-6 w-6 text-[#39FF14]" />
            <h1 className="text-2xl font-bold text-gray-800">Edit Item</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Item Type</label>
              <Select value={form.type} onValueChange={onTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="book">Book</SelectItem>
                  <SelectItem value="audiobook">Audiobook</SelectItem>
                  <SelectItem value="dvd">DVD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <Input name="itemName" value={form.itemName} onChange={onChange} />
            </div>

            {/* Genre */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Genre</label>
              <Input name="genre" value={form.genre} onChange={onChange} />
            </div>

            {/* Date */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Publication Date</label>
              <Input name="date" type="date" value={form.date} onChange={onChange} />
            </div>

            {/* Total Copies */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Total Copies</label>
              <Input
                name="totalCopies"
                type="number"
                value={form.totalCopies}
                onChange={onChange}
              />
            </div>

            {/* Cover URL */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">Cover Image URL</label>
              <Input name="imageUrl" value={form.imageUrl} onChange={onChange} />
            </div>

            {/* Blurb */}
            <div className="md:col-span-2">
              <label className="block mb-1 text-sm font-medium text-gray-700">Blurb</label>
              <Textarea name="blurb" value={form.blurb} onChange={onChange} />
            </div>

            {/* Book-only */}
            {form.type === "book" && (
              <>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                  <Input name="authorName" value={form.authorName} onChange={onChange} />
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700">Publisher</label>
                  <Input name="publisher" value={form.publisher} onChange={onChange} />
                </div>
              </>
            )}

            {/* Audiobook-only */}
            {form.type === "audiobook" && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
                  <Input name="authorName" value={form.authorName} onChange={onChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Narrator</label>
                  <Input name="narrator" value={form.narrator} onChange={onChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Duration</label>
                  <Input name="duration" value={form.duration} onChange={onChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Publisher</label>
                  <Input name="publisher" value={form.publisher} onChange={onChange} />
                </div>
              </>
            )}

            {/* DVD-only */}
            {form.type === "dvd" && (
              <>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Director</label>
                  <Input name="director" value={form.director} onChange={onChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Producer</label>
                  <Input name="producer" value={form.producer} onChange={onChange} />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Duration</label>
                  <Input name="duration" value={form.duration} onChange={onChange} />
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            <Button variant="ghost" onClick={() => router.push("/catalog")}>
              Cancel
            </Button>
            <Button
              onClick={onSave}
              disabled={loading}
              className="bg-[#39FF14] text-black hover:bg-[#39FF14]/90"
            >
              {loading
                ? <Loader2 className="animate-spin h-4 w-4" />
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
