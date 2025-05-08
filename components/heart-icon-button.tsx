"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/components/favorites-provider"

interface HeartIconButtonProps {
  productId: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export default function HeartIconButton({ productId, size = "md", className }: HeartIconButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const active = isFavorite(productId)

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className={`${sizeClasses[size]} rounded-full relative overflow-hidden hover:bg-white/0 ${
        active ? "text-red-500 hover:text-red-600" : "text-gray-600 hover:text-gray-900"
      } ${className || ""}`}
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite(productId)
      }}
      style={{
        backgroundImage: "url('/images/iconolulaweb.png')",
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        width: 'auto',
        height: 'auto',
        aspectRatio: '1/1'
      }}
    >
      <div className={`absolute inset-0 ${active ? 'bg-white/20' : 'bg-white/90'} backdrop-blur-sm transition-all`}></div>
      <Heart className={`${iconSizes[size]} ${active ? "fill-current" : ""} relative z-10`} />
      <span className="sr-only">
        {active ? "Eliminar de favoritos" : "Añadir a favoritos"}
      </span>
    </Button>
  )
}
