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
import { useProducts } from "@/components/products-provider"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const categories = [
  {
    name: "Todos",
    value: "todos",
    description: "Ver todos los productos disponibles",
  },
  {
    name: "Muebles",
    value: "muebles",
    description: "Muebles para el hogar",
    icon: "🪑",
  },
  {
    name: "Iluminación",
    value: "iluminacion",
    description: "Lámparas y accesorios de iluminación",
    icon: "💡",
  },
  {
    name: "Decoración",
    value: "decoracion",
    description: "Artículos decorativos",
    icon: "🎨",
  },
  {
    name: "Electrónica",
    value: "electronica",
    description: "Dispositivos y accesorios electrónicos",
    icon: "📱",
  },
]

export default function CategoriesPage() {
  const { products, loading } = useProducts()
  const [activeProducts, setActiveProducts] = useState(products)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState("grid")
  const [activeCategory, setActiveCategory] = useState("todos")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortOrder, setSortOrder] = useState("featured")

  const { toast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Manejar el filtrado y búsqueda de productos
  useEffect(() => {
    let filtered = [...products]

    // Filtrar por categoría
    if (activeCategory !== "todos") {
      filtered = filtered.filter(product => product.categoria === activeCategory)
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(product => 
        product.nombre.toLowerCase().includes(query) || 
        product.descripcion.toLowerCase().includes(query)
      )
    }

    // Ordenar productos
    switch (sortOrder) {
      case "price-asc":
        filtered.sort((a, b) => a.precio - b.precio)
        break
      case "price-desc":
        filtered.sort((a, b) => b.precio - a.precio)
        break
      case "name-asc":
        filtered.sort((a, b) => a.nombre.localeCompare(b.nombre))
        break
      case "stock-asc":
        filtered.sort((a, b) => a.stock - b.stock)
        break
      case "stock-desc":
        filtered.sort((a, b) => b.stock - a.stock)
        break
    }

    setActiveProducts(filtered)
  }, [activeCategory, searchQuery, sortOrder, products])

  const openProductModal = useCallback((product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }, [])

  const closeProductModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }, [])

  const handleToggleFavorite = useCallback((productId: string) => {
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
      : products.filter(p => p.categoria === category.value).length
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium capitalize">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                  {category.icon && (
                    <span className="text-2xl">{category.icon}</span>
                  )}
                </div>
                <p className="mt-4 text-xl font-bold">
                  {category.count} {category.count === 1 ? "producto" : "productos"}
                </p>
              </Card>
            ))}
          </div>

          {/* Barra de búsqueda y filtros */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Ordenar por
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
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
                              viewMode === "list" ? "w-48 h-32" : "h-64"
                            }`} 
                            onClick={() => openProductModal(product)}
                          >
                            <Image
                              src={product.imagen || "/placeholder.svg"}
                              alt={product.nombre}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                              sizes={viewMode === "list" ? "12rem" : "auto"}
                            />
                            <div className="absolute top-2 right-2">
                              <HeartIconButton productId={product.id} size="sm" />
                            </div>
                          </div>
                          <div className={`p-4 flex flex-col ${viewMode === "list" ? "flex-1" : ""}`}>
                            <h3 className="font-medium text-lg line-clamp-1">{product.nombre}</h3>
                            <p className="text-xl font-bold mt-2">${product.precio.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{product.descripcion}</p>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                              <Badge variant="secondary">
                                {product.stock} en stock
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {product.categoria}
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