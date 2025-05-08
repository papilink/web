"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Trash2, Upload, Database, Video, Edit2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import AdminChatInterface from "@/components/admin-chat-interface"
import { useProducts } from "@/components/products-provider"

interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  imagen: string
}

export default function AdminPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { products, loading, error, refreshProducts } = useProducts()
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
    image: "/placeholder.svg"
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result)
          if (editingProduct) {
            setEditingProduct({ ...editingProduct, imagen: reader.result })
          } else {
            setNewProduct({ ...newProduct, image: reader.result })
          }
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

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    try {
      const precioNum = parseFloat(newProduct.price)
      const stockNum = parseInt(newProduct.stock) || 0

      if (isNaN(precioNum) || precioNum < 0) {
        toast({
          title: "Error",
          description: "El precio debe ser un número válido y positivo",
          variant: "destructive",
        })
        return
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: newProduct.name,
          descripcion: newProduct.description,
          precio: precioNum,
          categoria: newProduct.category,
          stock: stockNum,
          imagen: newProduct.image
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear el producto')
      }

      await refreshProducts()

      setNewProduct({
        name: "",
        price: "",
        description: "",
        category: "",
        stock: "",
        image: "/placeholder.svg",
      })
      setPreviewImage(null)

      toast({
        title: "Éxito",
        description: "El producto ha sido agregado exitosamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear el producto",
        variant: "destructive",
      })
    }
  }

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/productos?id=${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editingProduct.nombre,
          descripcion: editingProduct.descripcion,
          precio: editingProduct.precio,
          categoria: editingProduct.categoria,
          stock: editingProduct.stock,
          imagen: editingProduct.imagen
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar el producto')
      }

      await refreshProducts()
      setEditingProduct(null)

      toast({
        title: "Éxito",
        description: "El producto ha sido actualizado exitosamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el producto",
        variant: "destructive",
      })
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!id) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/productos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Error al eliminar el producto')
      }

      await refreshProducts()

      toast({
        title: "Producto eliminado",
        description: "El producto ha sido eliminado exitosamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el producto",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p className="text-gray-600">Gestiona los productos de tu tienda</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={() => router.push("/admin/database")}>
              <Database className="h-4 w-4 mr-2" />
              Base de Datos
            </Button>
            <Button variant="outline" onClick={() => router.push("/admin/videos")}>
              <Video className="h-4 w-4 mr-2" />
              Videos
            </Button>
          </div>
        </header>

        <Tabs defaultValue="products">
          <TabsList className="mb-4">
            <TabsTrigger value="products">
              Productos
              <Badge variant="secondary" className="ml-2">
                {products?.length || 0}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="messages">
              Mensajes
              <Badge variant="secondary" className="ml-2">0</Badge>
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
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Categoría</Label>
                      <select
                        id="category"
                        name="category"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="Notebooks">Notebooks</option>
                        <option value="PCs desktop">PCs desktop</option>
                        <option value="Lavarropas">Lavarropas</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, description: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Imagen</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                          <Image
                            src={previewImage || newProduct.image}
                            alt="Vista previa"
                            fill
                            sizes="(max-width: 768px) 100vw, 64px"
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
                    <CardDescription>Administra los productos de tu tienda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {loading ? (
                        <div className="animate-pulse space-y-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                              <div className="h-16 w-16 bg-gray-200 rounded-md"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : error ? (
                        <div className="text-center text-red-500 py-8">
                          Error al cargar los productos: {error}
                        </div>
                      ) : products.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">No hay productos disponibles</p>
                      ) : (
                        products.map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-4 rounded-lg border">
                            <div className="relative h-16 w-16 overflow-hidden rounded-md flex-shrink-0">
                              <Image
                                src={product.imagen || "/placeholder.svg"}
                                alt={product.nombre}
                                fill
                                sizes="(max-width: 768px) 100vw, 64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900">{product.nombre}</h3>
                              <p className="text-sm text-gray-500 truncate">{product.descripcion}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-medium text-gray-900">
                                  ${product.precio.toFixed(2)}
                                </span>
                                <span className="text-sm text-gray-500">
                                  Stock: {product.stock}
                                </span>
                                <Badge variant="secondary">{product.categoria}</Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                    onClick={() => setEditingProduct(product)}
                                  >
                                    <Edit2 className="h-5 w-5" />
                                    <span className="sr-only">Editar</span>
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Editar Producto</DialogTitle>
                                    <DialogDescription>
                                      Modifica los detalles del producto y guarda los cambios.
                                    </DialogDescription>
                                  </DialogHeader>
                                  {editingProduct && (
                                    <form onSubmit={handleEditProduct} className="space-y-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-name">Nombre</Label>
                                        <Input
                                          id="edit-name"
                                          value={editingProduct.nombre}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              nombre: e.target.value,
                                            })
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-price">Precio</Label>
                                        <Input
                                          id="edit-price"
                                          type="number"
                                          step="0.01"
                                          value={editingProduct.precio}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              precio: parseFloat(e.target.value),
                                            })
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-stock">Stock</Label>
                                        <Input
                                          id="edit-stock"
                                          type="number"
                                          value={editingProduct.stock}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              stock: parseInt(e.target.value),
                                            })
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-category">Categoría</Label>
                                        <select
                                          id="edit-category"
                                          value={editingProduct.categoria}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              categoria: e.target.value,
                                            })
                                          }
                                          required
                                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        >
                                          <option value="">Selecciona una categoría</option>
                                          <option value="Notebooks">Notebooks</option>
                                          <option value="PCs desktop">PCs desktop</option>
                                          <option value="Lavarropas">Lavarropas</option>
                                        </select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label htmlFor="edit-description">Descripción</Label>
                                        <Textarea
                                          id="edit-description"
                                          value={editingProduct.descripcion}
                                          onChange={(e) =>
                                            setEditingProduct({
                                              ...editingProduct,
                                              descripcion: e.target.value,
                                            })
                                          }
                                          required
                                        />
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Imagen</Label>
                                        <div className="flex items-center gap-4">
                                          <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                            <Image
                                              src={editingProduct.imagen || "/placeholder.svg"}
                                              alt="Vista previa"
                                              fill
                                              sizes="(max-width: 768px) 100vw, 64px"
                                              className="object-cover"
                                            />
                                          </div>
                                          <label htmlFor="edit-image-upload" className="cursor-pointer">
                                            <div className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                                              <Upload className="h-4 w-4" />
                                              <span>Cambiar imagen</span>
                                            </div>
                                            <input
                                              id="edit-image-upload"
                                              type="file"
                                              accept="image/*"
                                              onChange={handleImageChange}
                                              className="sr-only"
                                            />
                                          </label>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button type="submit">Guardar cambios</Button>
                                      </DialogFooter>
                                    </form>
                                  )}
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                    <span className="sr-only">Eliminar</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>¿Está seguro que desea eliminar este producto?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta acción no se puede deshacer y eliminará permanentemente el producto de la base de datos.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                      Eliminar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
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
            <AdminChatInterface />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
