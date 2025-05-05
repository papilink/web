"use client"

import { useState, useEffect } from "react"
import { X, Heart } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import HeartIconButton from "@/components/heart-icon-button"

export default function FavoritesDrawer({ favorites = [], products = [], onClose, onRemoveFavorite }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  const favoriteProducts = products.filter((product) => favorites.includes(product.id))

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  if (favoriteProducts.length === 0) {
    return (
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } animate-in slide-in-from-right`}
      >
        <div className="flex items-center justify-between p-4 border-b animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            <h2 className="text-lg font-semibold">Mis Favoritos</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={handleClose} className="hover-scale active-scale">
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center h-[calc(100vh-73px)] p-6 text-center animate-in fade-in-50 duration-500">
          <div className="relative h-20 w-20 mb-4 animate-in zoom-in-50 duration-500">
            <HeartIconButton productId={0} size="lg" className="pointer-events-none" />
          </div>
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
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500 animate-pulse" />
          <h2 className="text-lg font-semibold">Mis Favoritos</h2>
          <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full animate-in zoom-in duration-300">
            {favoriteProducts.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={handleClose} className="hover-scale active-scale">
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="p-4 space-y-4">
          {favoriteProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="flex gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-smooth card-hover animate-in fade-in-50 slide-in-from-right duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500 truncate">${product.price.toFixed(2)}</p>
                <div className="mt-2">
                  <Button variant="outline" size="sm" className="text-xs h-8 btn-animated">
                    Ver detalles
                  </Button>
                </div>
              </div>
              <div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 hover-scale active-scale"
                  onClick={() => onRemoveFavorite(product.id)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
