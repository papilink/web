"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Grid, List, Search, SlidersHorizontal, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import HeartIconButton from "@/components/heart-icon-button"
import SiteHeader from "@/components/site-header"
import ProductModal from "@/components/product-modal"
import { useFavorites } from "@/components/favorites-provider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

// Datos de ejemplo
const products: Product[] = [
  {
    id: 1,
    name: "Lavarropas Samsung",
    price: 450.99,
    description: "Lavarropas automático Samsung con múltiples programas de lavado. Excelente estado.",
    image: "/images/lava10.jpg",
    category: "lavarropas",
    stock: 5
  },
  {
    id: 2,
    name: "Notebook Lenovo",
    price: 620.0,
    description: "Notebook Lenovo ThinkPad en perfecto estado. Ideal para trabajo y estudio.",
    image: "/images/lava10.jpg",
    category: "notebooks",
    stock: 3
  },
  {
    id: 3,
    name: "PC de Escritorio HP",
    price: 585.5,
    description: "Computadora de escritorio HP con monitor incluido. Lista para usar.",
    image: "/images/lava10.jpg",
    category: "computadoras",
    stock: 2
  },
  {
    id: 4,
    name: "Ventilador de Pie",
    price: 35.25,
    description: "Ventilador de pie con 3 velocidades y oscilación. Perfecto para el verano.",
    image: "/images/lava10.jpg",
    category: "varios",
    stock: 10
  },
  {
    id: 5,
    name: "Impresora Multifunción",
    price: 175.0,
    description: "Impresora láser multifunción. Imprime, escanea y fotocopia.",
    image: "/images/lava10.jpg",
    category: "varios",
    stock: 4
  },
  {
    id: 6,
    name: "Monitor Gaming",
    price: 240.0,
    description: "Monitor gaming de 24 pulgadas, 144Hz. Ideal para juegos.",
    image: "/images/lava10.jpg",
    category: "computadoras",
    stock: 1
  }
]

const categories = [
  {
    name: "Todos",
    value: "todos",
    description: "Ver todos los productos disponibles",
  },
  {
    name: "Lavarropas",
    value: "lavarropas",
    description: "Lavarropas automáticos de diversas marcas",
  },
  {
    name: "Notebooks",
    value: "notebooks",
    description: "Laptops y notebooks de todas las marcas",
  },
  {
    name: "Computadora PC",
    value: "computadora PC",
    description: "PCs de escritorio y componentes",
  },
  {
    name: "Varios",
    value: "varios",
    description: "Productos variados en ocasión",
  }
]

export default function CategoriesPage() {
  const [activeProducts, setActiveProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeCategory, setActiveCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("featured")

  const { toast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  // Manejar el filtrado y búsqueda de productos
  useEffect(() => {
    let filtered = [...products]

    // Filtrar por categoría
    if (activeCategory !== "todos") {
      filtered = filtered.filter(product => product.category === activeCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      )
    }

    // Ordenar productos
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "stock-asc":
        filtered.sort((a, b) => a.stock - b.stock)
        break
      case "stock-desc":
        filtered.sort((a, b) => b.stock - a.stock)
        break
    }

    setActiveProducts(filtered)
  }, [activeCategory, searchQuery, sortOrder])

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

  const categoryStats = categories.map(category => ({
    ...category,
    count: category.value === "todos" 
      ? products.length 
      : products.filter(p => p.category === category.value).length
  }))

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Encabezado */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Categorías
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección de productos por categoría
            </p>
          </div>

          {/* Categorías */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categoryStats.map((category) => (
              <Card 
                key={category.value}
                className={`p-6 cursor-pointer transition-all hover:scale-105 ${
                  activeCategory === category.value ? "border-primary" : ""
                }`}
                onClick={() => setActiveCategory(category.value)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold capitalize">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  <Badge variant="secondary">{category.count}</Badge>
                </div>
              </Card>
            ))}
          </div>

          {/* Barra de filtros */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="w-full sm:w-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-[300px]"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Ordenar
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortOrder("featured")}>
                    Destacados
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("price-asc")}>
                    Precio: Menor a Mayor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("price-desc")}>
                    Precio: Mayor a Menor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("name-asc")}>
                    Nombre: A-Z
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("stock-desc")}>
                    Mayor stock
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("stock-asc")}>
                    Menor stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
              >
                {viewMode === "grid" ? (
                  <List className="h-4 w-4" />
                ) : (
                  <Grid className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Lista de productos */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className={`${viewMode === "grid" ? "h-64" : "h-32"} bg-muted rounded-t-lg`} />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/4" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <>
                {activeProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No se encontraron productos que coincidan con tu búsqueda</p>
                  </div>
                ) : (
                  <motion.div 
                    className={`grid gap-6 ${
                      viewMode === "grid" 
                        ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" 
                        : "grid-cols-1"
                    }`}
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
                    {activeProducts.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -4 }}
                        id={`product-${product.id}`}
                      >
                        <Card className={`overflow-hidden group cursor-pointer ${
                          viewMode === "list" ? "flex" : ""
                        }`}>
                          <div 
                            className={`relative ${
                              viewMode === "grid" ? "h-64" : "h-32 w-32 flex-shrink-0"
                            }`} 
                            onClick={() => openProductModal(product)}
                          >
                            <div className="absolute top-2 right-2 z-10" onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(product.id)
                            }}>
                              <HeartIconButton
                                productId={product.id}
                                className="bg-background/80 hover:bg-background"
                              />
                            </div>
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          </div>
                          <div className="p-4 flex flex-col flex-1">
                            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                            <p className="text-primary font-medium mt-1">${product.price.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.description}</p>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                              <Badge variant="secondary">
                                {product.stock} en stock
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {product.category}
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </>
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
      </main>
    </>
  )
}