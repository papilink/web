"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Plus, Trash2, Upload, Play, Link } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos de ejemplo para los productos
const products = [
  { id: 1, name: "Lámpara Vintage" },
  { id: 2, name: "Silla de Diseñador" },
  { id: 3, name: "Mesa de Centro" },
  { id: 4, name: "Jarrón Decorativo" },
  { id: 5, name: "Cuadro Abstracto" },
  { id: 6, name: "Reloj de Pared" },
]

// Datos de ejemplo para los videos
const initialVideos = [
  {
    id: 1,
    title: "Lámpara Vintage - Vista 360°",
    description: "Mira todos los detalles de nuestra lámpara vintage en este video de 360 grados.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product1.mp4",
    productId: 1,
  },
  {
    id: 2,
    title: "Silla de Diseñador - Demostración",
    description: "Observa la calidad y el diseño de nuestra silla de diseñador exclusiva.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product2.mp4",
    productId: 2,
  },
  {
    id: 3,
    title: "Mesa de Centro - Características",
    description: "Conoce todas las características de nuestra elegante mesa de centro.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product3.mp4",
    productId: 3,
  },
]

export default function AdminVideosPage() {
  const [videos, setVideos] = useState(initialVideos)
  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "",
    productId: "",
  })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [previewThumbnail, setPreviewThumbnail] = useState(null)
  const [previewVideo, setPreviewVideo] = useState(null)
  const videoInputRef = useRef(null)
  const thumbnailInputRef = useRef(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setNewVideo({
      ...newVideo,
      [name]: value,
    })
  }

  const handleProductSelect = (value) => {
    setNewVideo({
      ...newVideo,
      productId: value,
    })
  }

  const handleVideoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)

      // Create a preview URL for the video
      const videoURL = URL.createObjectURL(file)
      setPreviewVideo(videoURL)

      setNewVideo({
        ...newVideo,
        videoUrl: file.name, // In a real app, this would be the uploaded file URL
      })
    }
  }

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnailFile(file)

      // Create a preview URL for the thumbnail
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewThumbnail(reader.result)

        setNewVideo({
          ...newVideo,
          thumbnail: reader.result, // In a real app, this would be the uploaded file URL
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddVideo = (e) => {
    e.preventDefault()

    // Validación básica
    if (!newVideo.title || !newVideo.videoUrl) {
      toast({
        title: "Error",
        description: "Por favor completa al menos el título y sube un video",
        variant: "destructive",
      })
      return
    }

    // Agregar nuevo video
    const newVideoWithId = {
      ...newVideo,
      id: Date.now(), // Generar un ID único basado en timestamp
      productId: newVideo.productId ? Number.parseInt(newVideo.productId) : null,
    }

    setVideos([...videos, newVideoWithId])

    // Resetear el formulario
    setNewVideo({
      title: "",
      description: "",
      thumbnail: "/placeholder.svg?height=160&width=288",
      videoUrl: "",
      productId: "",
    })
    setVideoFile(null)
    setThumbnailFile(null)
    setPreviewThumbnail(null)
    setPreviewVideo(null)

    // Reset file inputs
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""

    toast({
      title: "Video agregado",
      description: "El video ha sido agregado exitosamente",
    })
  }

  const handleDeleteVideo = (id) => {
    setVideos(videos.filter((video) => video.id !== id))
    toast({
      title: "Video eliminado",
      description: "El video ha sido eliminado exitosamente",
    })
  }

  const handlePreviewVideo = (video) => {
    // Open video in a new tab
    window.open(video.videoUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Videos</h1>
            <p className="text-gray-600">Administra los videos para mostrar en la marquesina</p>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Formulario para agregar videos */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Agregar Nuevo Video</CardTitle>
              <CardDescription>Sube un video para mostrar en la marquesina</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddVideo} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título del video</Label>
                  <Input
                    id="title"
                    name="title"
                    value={newVideo.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Lámpara Vintage - Vista 360°"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newVideo.description}
                    onChange={handleInputChange}
                    placeholder="Describe el video..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productId">Producto relacionado (opcional)</Label>
                  <Select value={newVideo.productId} onValueChange={handleProductSelect}>
                    <SelectTrigger id="productId">
                      <SelectValue placeholder="Selecciona un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Ninguno</SelectItem>
                      {products.map((product) => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Video</Label>
                  <div className="flex flex-col gap-3">
                    {previewVideo ? (
                      <div className="relative aspect-video bg-black rounded-md overflow-hidden">
                        <video src={previewVideo} className="w-full h-full" controls />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded-md border border-dashed">
                        <p className="text-sm text-muted-foreground">No hay video seleccionado</p>
                      </div>
                    )}

                    <label htmlFor="video-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm w-full justify-center">
                        <Upload className="h-4 w-4" />
                        <span>{videoFile ? "Cambiar video" : "Subir video"}</span>
                      </div>
                      <input
                        id="video-upload"
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Miniatura (opcional)</Label>
                  <div className="flex flex-col gap-3">
                    <div className="relative h-32 bg-muted rounded-md overflow-hidden border">
                      <Image
                        src={previewThumbnail || newVideo.thumbnail}
                        alt="Vista previa de miniatura"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <label htmlFor="thumbnail-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm w-full justify-center">
                        <Upload className="h-4 w-4" />
                        <span>{thumbnailFile ? "Cambiar miniatura" : "Subir miniatura"}</span>
                      </div>
                      <input
                        id="thumbnail-upload"
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="sr-only"
                      />
                    </label>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Video
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lista de videos */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Videos Actuales</CardTitle>
                <CardDescription>Administra los videos de la marquesina</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {videos.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay videos disponibles</p>
                  ) : (
                    videos.map((video) => (
                      <div key={video.id} className="flex gap-4 p-4 rounded-lg border">
                        <div className="relative h-20 w-36 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                          <Image
                            src={video.thumbnail || "/placeholder.svg?height=80&width=144"}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-white hover:bg-white/20 hover:text-white"
                              onClick={() => handlePreviewVideo(video)}
                            >
                              <Play className="h-5 w-5" />
                              <span className="sr-only">Reproducir</span>
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{video.description}</p>

                          {video.productId && (
                            <div className="flex items-center gap-1 mt-1">
                              <Link className="h-3 w-3 text-primary" />
                              <span className="text-xs text-primary">
                                Producto: {products.find((p) => p.id === video.productId)?.name}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                            <span className="sr-only">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
