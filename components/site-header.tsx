"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingCart, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFavorites } from "@/components/favorites-provider"
import FavoritesButton from "@/components/favorites-button"

// Datos de ejemplo para los productos (en un sistema real, esto vendría de una base de datos)
const products = [
  {
    id: 1,
    name: "Lámpara Vintage",
    price: 45.99,
    description: "Lámpara de mesa vintage en excelente estado.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Silla de Diseñador",
    price: 120.0,
    description: "Silla de diseñador en madera y cuero.",
    image: "/placeholder.svg?height=400&width=400",
  },
  // ... más productos
]

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { favorites, removeFavorite } = useFavorites()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Lulaweb</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Categorías
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Ofertas
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Contacto
            </Link>
          </nav>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menú</span>
        </button>

        <Link href="/" className="mr-6 flex items-center md:hidden">
          <span className="font-bold text-xl">Lulaweb</span>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <FavoritesButton favorites={favorites} products={products} onRemoveFavorite={removeFavorite} />

            <Button variant="outline" size="icon">
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              <span className="sr-only">Carrito</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="container pb-3 md:hidden">
          <nav className="flex flex-col space-y-3 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-foreground/80">
              Inicio
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Categorías
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Ofertas
            </Link>
            <Link href="#" className="transition-colors hover:text-foreground/80">
              Contacto
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
