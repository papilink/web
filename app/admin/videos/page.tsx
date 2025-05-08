"use client"

import { useState, useRef, ChangeEvent } from "react"
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

interface Product {
  id: number;
  name: string;
}

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  productId: number | null;
}

interface NewVideo {
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  productId: string;
}

// Datos de ejemplo para los productos
const products: Product[] = [
  { id: 1, name: "Lámpara Vintage" },
  { id: 2, name: "Silla de Diseñador" },
  { id: 3, name: "Mesa de Centro" },
  { id: 4, name: "Jarrón Decorativo" },
  { id: 5, name: "Cuadro Abstracto" },
  { id: 6, name: "Reloj de Pared" },
]

// Datos de ejemplo para los videos
const initialVideos: Video[] = [
  {
    id: 1,
    title: "Lámpara Vintage - Vista 360°",
    description: "Mira todos los detalles de nuestra lámpara vintage en este video de 360 grados.",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "/videos/sample-product1.mp4",
    productId: 1,
  },
  {
    id: 2,
    title: "Silla de Diseñador - Demostración",
    description: "Observa la calidad y el diseño de nuestra silla de diseñador exclusiva.",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "/videos/sample-product2.mp4",
    productId: 2,
  },
  {
    id: 3,
    title: "Mesa de Centro - Características",
    description: "Conoce todas las características de nuestra elegante mesa de centro.",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "/videos/sample-product3.mp4",
    productId: 3,
  },
]

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>(initialVideos)
  const [newVideo, setNewVideo] = useState<NewVideo>({
    title: "",
    description: "",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "",
    productId: "",
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | null>(null)
  const [previewVideo, setPreviewVideo] = useState<string | null>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewVideo({
      ...newVideo,
      [name]: value,
    })
  }

  const handleProductSelect = (value: string) => {
    setNewVideo({
      ...newVideo,
      productId: value,
    })
  }

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

  const handleThumbnailUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setThumbnailFile(file)

      // Create a preview URL for the thumbnail
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPreviewThumbnail(reader.result)

          setNewVideo({
            ...newVideo,
            thumbnail: reader.result, // In a real app, this would be the uploaded file URL
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación completa
    if (!newVideo.title) {
      toast({
        title: "Error",
        description: "Por favor ingresa el título del video",
        variant: "destructive",
      })
      return
    }

    if (!videoFile) {
      toast({
        title: "Error",
        description: "Por favor sube un video",
        variant: "destructive",
      })
      return
    }

    // Preparar el nuevo video con valores correctos
    const newVideoWithId: Video = {
      ...newVideo,
      id: Date.now(),
      // Si productId es "none" o está vacío, será null, de lo contrario convertir a número
      productId: newVideo.productId && newVideo.productId !== "none" 
        ? Number(newVideo.productId) 
        : null,
      // Asegurar que tenemos una miniatura
      thumbnail: previewThumbnail || newVideo.thumbnail,
      // En un caso real, aquí se subiría el video a un servidor y se obtendría la URL
      videoUrl: videoFile.name
    }

    // Actualizar el estado de videos
    setVideos(prevVideos => [...prevVideos, newVideoWithId])

    // Mostrar mensaje de éxito
    toast({
      title: "Video agregado",
      description: "El video ha sido agregado exitosamente",
    })

    // Resetear el formulario
    setNewVideo({
      title: "",
      description: "",
      thumbnail: "/images/lava10.jpg",
      videoUrl: "",
      productId: "",
    })
    
    // Limpiar archivos y previsualizaciones
    setVideoFile(null)
    setThumbnailFile(null)
    setPreviewThumbnail(null)
    setPreviewVideo(null)

    // Limpiar los inputs de archivo
    if (videoInputRef.current) videoInputRef.current.value = ""
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""
  }

  const handleDeleteVideo = (id: number) => {
    setVideos(videos.filter((video) => video.id !== id))
    toast({
      title: "Video eliminado",
      description: "El video ha sido eliminado exitosamente",
    })
  }

  const handlePreviewVideo = (video: Video) => {
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
                            src={video.thumbnail || "/images/lava10.jpg"}
                            alt={video.title}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
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
