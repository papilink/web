"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useProducts } from "@/components/products-provider"

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  imagen: string;
}

interface FavoritesDrawerProps {
  favorites: string[]
  onClose: () => void
  onRemoveFavorite: (productId: string) => void
}

export default function FavoritesDrawer({ favorites = [], onClose, onRemoveFavorite }: FavoritesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { products } = useProducts()

  // Efecto de entrada
  useState(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 50)
    return () => clearTimeout(timer)
  })

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  // Filtrar productos favoritos
  const favoriteProducts = products.filter(product => favorites.includes(product.id))

  // Si no hay favoritos
  if (favoriteProducts.length === 0) {
    return (
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } animate-in slide-in-from-right`}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={handleClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
          <h3 className="text-lg font-medium mb-2 animate-in fade-in-50 slide-in-from-bottom-2">No tienes favoritos</h3>
          <p className="text-gray-500 mb-6 animate-in fade-in-50 slide-in-from-bottom-3">
            Guarda tus productos favoritos haciendo clic en el corazón en cada producto.
          </p>
          <Button onClick={handleClose} className="btn-animated">Explorar productos</Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } animate-in slide-in-from-right`}
    >
      <div className="flex items-center justify-between p-4 border-b animate-in fade-in slide-in-from-top duration-300">
        <h2 className="text-lg font-semibold">Mis Favoritos</h2>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>

      <div className="p-4 space-y-4 overflow-auto max-h-[calc(100vh-73px)]">
        <motion.div
          layout
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {favoriteProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <Image
                    src={product.imagen || "/placeholder.svg"}
                    alt={product.nombre}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{product.nombre}</h3>
                  <p className="text-sm text-gray-500">${product.precio.toFixed(2)}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveFavorite(product.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Eliminar de favoritos</span>
                </Button>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
