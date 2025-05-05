"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, Upload, Database, Video } from "lucide-react"
import { ChangeEvent, FormEvent } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import AdminChatInterface from "@/components/admin-chat-interface"

// Datos de ejemplo para los productos
const initialProducts = [
  {
    id: 1,
    name: "Lámpara Vintage",
    price: 45.99,
    description:
      "Lámpara de mesa vintage en excelente estado. Perfecta para dar un toque elegante a cualquier habitación.",
    image: "/images/lava10.jpg",
  },
  {
    id: 2,
    name: "Silla de Diseñador",
    price: 120.0,
    description: "Silla de diseñador en madera y cuero. Muy cómoda y en perfecto estado.",
    image: "/images/lava10.jpg",
  },
  {
    id: 3,
    name: "Mesa de Centro",
    price: 85.5,
    description: "Mesa de centro de cristal con base de madera. Elegante y funcional.",
    image: "/images/lava10.jpg",
  },
]

export default function AdminPage() {
  const [products, setProducts] = useState(initialProducts)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    image: "/images/lava10.jpg",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewProduct({
      ...newProduct,
      [name]: name === "price" ? Number.parseFloat(value) || "" : value,
    })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar el tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Por favor selecciona una imagen en formato JPG, PNG o WebP",
          variant: "destructive",
        })
        return
      }

      // Validar el tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB",
          variant: "destructive",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = () => {
        try {
          if (typeof reader.result === 'string') {
            setPreviewImage(reader.result)
            setNewProduct({
              ...newProduct,
              image: reader.result,
            })
            toast({
              title: "Imagen cargada",
              description: "La imagen se ha cargado correctamente",
            })
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Hubo un error al procesar la imagen",
            variant: "destructive",
          })
          console.error("Error al procesar la imagen:", error)
        }
      }

      reader.onerror = () => {
        toast({
          title: "Error",
          description: "No se pudo leer el archivo",
          variant: "destructive",
        })
      }

      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validación básica
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    // Agregar nuevo producto
    const newProductWithId = {
      ...newProduct,
      id: Date.now(), // Generar un ID único basado en timestamp
      price: Number.parseFloat(newProduct.price),
    }

    setProducts([...products, newProductWithId])

    // Resetear el formulario
    setNewProduct({
      name: "",
      price: "",
      description: "",
      image: "/images/lava10.jpg",
    })
    setPreviewImage(null)

    toast({
      title: "Producto agregado",
      description: "El producto ha sido agregado exitosamente",
    })
  }

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((product) => product.id !== id))
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado exitosamente",
    })
  }

  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente",
    })
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona los productos de tu venta de garage</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => router.push("/admin/videos")}>
              <Video className="h-4 w-4" />
              <span className="hidden sm:inline">Videos</span>
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => router.push("/admin/database")}
            >
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Base de Datos</span>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </div>
        </header>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="messages">
              Mensajes
              <Badge variant="secondary" className="ml-2">
                3
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Formulario para agregar productos */}
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Agregar Nuevo Producto</CardTitle>
                  <CardDescription>Completa el formulario para agregar un nuevo producto</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProduct} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre del producto</Label>
                      <Input
                        id="name"
                        name="name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                        placeholder="Ej: Lámpara Vintage"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Precio ($)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        placeholder="Ej: 45.99"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                        placeholder="Describe el producto..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Imagen</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                          <Image
                            src={previewImage || newProduct.image}
                            alt="Vista previa"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                            <Upload className="h-4 w-4" />
                            <span>Subir imagen</span>
                          </div>
                          <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Producto
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Lista de productos */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Productos Actuales</CardTitle>
                    <CardDescription>Administra los productos de tu venta de garage</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay productos disponibles</p>
                      ) : (
                        products.map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                              <Image
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                              <p className="text-sm text-gray-500 truncate">${product.price.toFixed(2)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">Eliminar</span>
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Mensajes de Clientes</CardTitle>
                <CardDescription>Responde a las preguntas de los clientes sobre tus productos</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminChatInterface />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
