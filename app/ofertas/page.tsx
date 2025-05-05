"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronUp, Tag, Percent, AlertCircle } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HeartIconButton from "@/components/heart-icon-button"
import SiteHeader from "@/components/site-header"
import ProductModal from "@/components/product-modal"
import { useFavorites } from "@/components/favorites-provider"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
  originalPrice?: number
  discountPercentage?: number
}

// Datos de ejemplo con descuentos
const discountedProducts: Product[] = [
  {
    id: 1,
    name: "Lámpara Vintage",
    price: 35.99,
    originalPrice: 45.99,
    discountPercentage: 22,
    description: "Lámpara de mesa estilo vintage en excelente estado. Perfecta para dar un toque retro a cualquier habitación.",
    image: "/images/lava10.jpg",
    category: "iluminación",
    stock: 5
  },
  {
    id: 2,
    name: "Silla de Diseñador",
    price: 89.99,
    originalPrice: 120.0,
    discountPercentage: 25,
    description: "Silla de diseñador en madera y cuero. Muy cómoda y en perfecto estado.",
    image: "/images/lava10.jpg",
    category: "muebles",
    stock: 3
  },
  {
    id: 3,
    name: "Mesa de Centro",
    price: 69.99,
    originalPrice: 85.5,
    discountPercentage: 18,
    description: "Mesa de centro de cristal con base de madera. Elegante y funcional.",
    image: "/images/lava10.jpg",
    category: "muebles",
    stock: 2
  },
  {
    id: 4,
    name: "Cuadro Abstracto",
    price: 55.0,
    originalPrice: 75.0,
    discountPercentage: 27,
    description: "Cuadro abstracto con marco de madera. Colores vibrantes que darán vida a tu espacio.",
    image: "/images/lava10.jpg",
    category: "decoración",
    stock: 4
  },
  {
    id: 5,
    name: "Reloj de Pared",
    price: 28.0,
    originalPrice: 40.0,
    discountPercentage: 30,
    description: "Reloj de pared estilo industrial. Funciona perfectamente.",
    image: "/images/lava10.jpg",
    category: "decoración",
    stock: 1
  }
]

export default function OffersPage() {
  const [products, setProducts] = useState(discountedProducts)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState("discount")
  const [filterCategory, setFilterCategory] = useState("todos")
  const [loading, setLoading] = useState(true)

  const { toast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleProductSort = useCallback((order: string) => {
    const sortedProducts = [...products]
    switch (order) {
      case "discount":
        sortedProducts.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
        break
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      default:
        return setProducts(discountedProducts)
    }
    setProducts(sortedProducts)
  }, [products])

  const filteredProducts = useCallback(() => {
    if (filterCategory === "todos") return products
    return products.filter(product => product.category === filterCategory)
  }, [products, filterCategory])

  const openProductModal = useCallback((product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }, [])

  const handleToggleFavorite = useCallback((productId: number) => {
    toggleFavorite(productId)
    const action = isFavorite(productId) ? "eliminado de" : "añadido a"
    toast({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} favoritos`,
      description: `El producto ha sido ${action} tus favoritos`,
      variant: isFavorite(productId) ? "default" : "destructive"
    })
  }, [toggleFavorite, isFavorite, toast])

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Encabezado */}
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Tag className="h-8 w-8 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Ofertas Especiales
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Encuentra increíbles descuentos en productos seleccionados
            </p>
          </motion.header>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <Card className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mayor descuento</p>
                <p className="text-2xl font-bold">30% OFF</p>
              </div>
            </Card>
            <Card className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Tag className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos en oferta</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </Card>
            <Card className="p-6 flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock limitado</p>
                <p className="text-2xl font-bold">¡Date prisa!</p>
              </div>
            </Card>
          </motion.div>

          {/* Filtros y Ordenamiento */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {["todos", "muebles", "iluminación", "decoración"].map((category) => (
                <Button
                  key={category}
                  variant={filterCategory === category ? "default" : "outline"}
                  onClick={() => setFilterCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
            <select
              className="form-select bg-background border rounded-md px-4 py-2"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value)
                handleProductSort(e.target.value)
              }}
            >
              <option value="discount">Mayor descuento</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
            </select>
          </div>

          {/* Grid de Productos */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-64 bg-muted rounded-t-lg" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {filteredProducts().map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ y: -4 }}
                    id={`product-${product.id}`}
                  >
                    <Card className="overflow-hidden group cursor-pointer">
                      <div className="relative" onClick={() => openProductModal(product)}>
                        <div className="relative h-64">
                          <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-500">
                            -{product.discountPercentage}% OFF
                          </Badge>
                          {product.stock <= 3 && (
                            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                              ¡Últimas {product.stock} unidades!
                            </Badge>
                          )}
                          <div className="absolute bottom-2 right-2 z-10" onClick={(e) => {
                            e.stopPropagation()
                            handleToggleFavorite(product.id)
                          }}>
                            <HeartIconButton
                              productId={product.id}
                              className="bg-background/80 hover:bg-background"
                            />
                          </div>
                          <div className="relative h-full w-full overflow-hidden">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                          <span className="text-sm text-muted-foreground line-through">${product.originalPrice?.toFixed(2)}</span>
                          <Badge variant="secondary" className="ml-auto">
                            Ahorra ${(product.originalPrice! - product.price).toFixed(2)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal de Producto */}
        <AnimatePresence>
          {isModalOpen && selectedProduct && (
            <ProductModal 
              product={selectedProduct} 
              isOpen={isModalOpen} 
              onClose={closeProductModal}
            />
          )}
        </AnimatePresence>

        {/* Botón de volver arriba */}
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:scale-110 transition-transform"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="h-6 w-6" />
          <span className="sr-only">Volver arriba</span>
        </Button>
      </main>
    </>
  )
}