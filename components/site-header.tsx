"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, ShoppingCart, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useFavorites } from "@/components/favorites-provider"
import FavoritesButton from "@/components/favorites-button"
import CartDrawer from "@/components/cart-drawer"
import { useCart } from "@/components/cart-provider"
import { Badge } from "@/components/ui/badge"
import { useProducts } from "@/components/products-provider"

// Datos de ejemplo (en un sistema real, esto vendría de una API o base de datos)
export const siteConfig = {
  name: "Lulaweb",
  mainNav: [
    {
      title: "Inicio",
      href: "/",
    },
    {
      title: "Categorías",
      href: "/categorias",
    },
    {
      title: "Ofertas",
      href: "/ofertas",
    },
    {
      title: "Contacto",
      href: "/contacto",
    },
  ],
}

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { favorites, removeFavorite } = useFavorites()
  const { getTotalItems } = useCart()
  const { products } = useProducts()

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    // Aquí iría la lógica de búsqueda
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* Navegación de escritorio */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image 
              src="/images/iconolulaweb.png"
              alt="Lulaweb Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-bold text-xl">{siteConfig.name}</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Botón de menú móvil */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Logo móvil */}
        <Link href="/" className="mr-6 flex items-center md:hidden gap-2">
          <Image 
            src="/images/iconolulaweb.png"
            alt="Lulaweb Logo"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-bold text-xl">{siteConfig.name}</span>
        </Link>

        {/* Barra de búsqueda y acciones */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[300px]"
              />
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <FavoritesButton
              favorites={favorites}
              products={products}
              onRemoveFavorite={removeFavorite}
            />
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-[1.2rem] w-[1.2rem]" />
              {getTotalItems() > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {getTotalItems()}
                </Badge>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="container pb-3 md:hidden">
          <nav className="flex flex-col space-y-3">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-2 py-1 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Carrito */}
      {isCartOpen && (
        <CartDrawer
          products={products}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </header>
  )
}
