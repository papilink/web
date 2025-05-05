"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

import ProductModal from "@/components/product-modal"
import { useToast } from "@/hooks/use-toast"
import VideoMarquee from "@/components/video-marquee"
import HeartIconButton from "@/components/heart-icon-button"
import SiteHeader from "@/components/site-header"
import { useFavorites } from "@/components/favorites-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  stock: number;
}

interface Video {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  productId: number;
  duration: string;
}

// Datos de ejemplo para los productos
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Lámpara Vintage",
    price: 45.99,
    description: "Lámpara de mesa estilo vintage en excelente estado. Perfecta para dar un toque retro a cualquier habitación.",
    image: "/images/lava10.jpg",
    category: "iluminación",
    stock: 5
  },
  {
    id: 2,
    name: "Silla de Diseñador",
    price: 120.0,
    description: "Silla de diseñador en madera y cuero. Muy cómoda y en perfecto estado.",
    image: "/images/lava10.jpg",
    category: "muebles",
    stock: 3
  },
  {
    id: 3,
    name: "Mesa de Centro",
    price: 85.5,
    description: "Mesa de centro de cristal con base de madera. Elegante y funcional.",
    image: "/images/lava10.jpg",
    category: "muebles",
    stock: 2
  },
  {
    id: 4,
    name: "Jarrón Decorativo",
    price: 35.25,
    description: "Jarrón decorativo de cerámica pintado a mano. Pieza única.",
    image: "/images/lava10.jpg",
    category: "decoración",
    stock: 10
  },
  {
    id: 5,
    name: "Cuadro Abstracto",
    price: 75.0,
    description: "Cuadro abstracto con marco de madera. Colores vibrantes que darán vida a tu espacio.",
    image: "/images/lava10.jpg",
    category: "decoración",
    stock: 4
  },
  {
    id: 6,
    name: "Reloj de Pared",
    price: 40.0,
    description: "Reloj de pared estilo industrial. Funciona perfectamente.",
    image: "/images/lava10.jpg",
    category: "decoración",
    stock: 1
  },
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
    duration: "0:45"
  },
  {
    id: 2,
    title: "Silla de Diseñador - Demostración",
    description: "Observa la calidad y el diseño de nuestra silla de diseñador exclusiva.",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "/videos/sample-product2.mp4",
    productId: 2,
    duration: "1:15"
  },
  {
    id: 3,
    title: "Mesa de Centro - Características",
    description: "Conoce todas las características de nuestra elegante mesa de centro.",
    thumbnail: "/images/lava10.jpg",
    videoUrl: "/videos/sample-product3.mp4",
    productId: 3,
    duration: "0:30"
  },
]

export default function Home() {
  const [products, setProducts] = useState(initialProducts)
  const [videos, setVideos] = useState(initialVideos)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState("featured")
  const [filterCategory, setFilterCategory] = useState("todos")
  
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
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        // Mantener orden original (featured)
        return setProducts(initialProducts)
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
          <motion.header 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Lula<span className="text-primary">web</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubre piezas únicas en nuestra venta de garage con estilo
            </p>
          </motion.header>

          {/* Video Marquee Section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <VideoMarquee videos={videos} />
          </motion.section>

          {/* Filtros y Ordenamiento */}
          <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
            <div className="flex gap-2">
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
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="name-asc">Nombre: A-Z</option>
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
                    className="group relative bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden" onClick={() => openProductModal(product)}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        priority={product.id === 1}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Video indicator */}
                      {videos.some((video) => video.productId === product.id) && (
                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                          Video
                        </div>
                      )}

                      {/* Stock badge */}
                      {product.stock < 3 && (
                        <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs px-2 py-1 rounded-full">
                          ¡Últimas {product.stock} unidades!
                        </div>
                      )}

                      {/* Heart icon button */}
                      <div className="absolute bottom-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
                        <HeartIconButton 
                          productId={product.id} 
                          onToggle={() => handleToggleFavorite(product.id)}
                          className="bg-background/80 hover:bg-background"
                        />
                      </div>
                    </div>
                    <div className="p-4 space-y-2" onClick={() => openProductModal(product)}>
                      <h3 className="text-lg font-semibold text-foreground line-clamp-1">{product.name}</h3>
                      <p className="text-primary font-medium">${product.price.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isModalOpen && selectedProduct && (
            <ProductModal 
              product={selectedProduct} 
              isOpen={isModalOpen} 
              onClose={closeProductModal}
              relatedVideos={videos.filter(v => v.productId === selectedProduct.id)}
            />
          )}
        </AnimatePresence>
      </main>
    </>
  )
}
