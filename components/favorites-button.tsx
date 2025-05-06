"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useFavorites } from "@/components/favorites-provider"
import FavoritesDrawer from "@/components/favorites-drawer"

export default function FavoritesButton() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const { favorites, removeFavorite } = useFavorites()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsDrawerOpen(true)}
      >
        <Heart className="h-5 w-5" />
        {favorites.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
            {favorites.length}
          </span>
        )}
        <span className="sr-only">Ver favoritos</span>
      </Button>

      {isDrawerOpen && (
        <FavoritesDrawer
          favorites={favorites}
          onClose={() => setIsDrawerOpen(false)}
          onRemoveFavorite={removeFavorite}
        />
      )}
    </>
  )
}
