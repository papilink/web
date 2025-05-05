"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import FavoritesDrawer from "@/components/favorites-drawer"

export default function FavoritesButton({ favorites = [], products = [], onRemoveFavorite }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }

  return (
    <>
      <Button variant="outline" size="icon" className="relative" onClick={toggleDrawer} aria-label="Ver favoritos">
        <Heart className="h-[1.2rem] w-[1.2rem]" />
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
            {favorites.length}
          </span>
        )}
      </Button>

      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsDrawerOpen(false)} />
          <FavoritesDrawer
            favorites={favorites}
            products={products}
            onClose={() => setIsDrawerOpen(false)}
            onRemoveFavorite={onRemoveFavorite}
          />
        </>
      )}
    </>
  )
}
