"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeartIconButtonProps {
  productId: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
  className?: string
  onToggle?: (isFavorite: boolean) => void
}

export default function HeartIconButton({
  productId,
  size = "md",
  showLabel = false,
  className,
  onToggle,
}: HeartIconButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  const handleToggle = () => {
    const newState = !isFavorite
    setIsFavorite(newState)
    if (onToggle) onToggle(newState)
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  return (
    <button
      className={cn(
        "group relative flex items-center justify-center rounded-full transition-all",
        showLabel ? "gap-2" : "",
        className,
      )}
      onClick={handleToggle}
      aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
    >
      <div className={cn("relative", sizeClasses[size])}>
        {/* Contorno de corazón */}
        <Heart
          className={cn("absolute inset-0 transition-all", isFavorite ? "fill-red-500 text-red-500" : "text-red-500")}
        />

        {/* Imagen dentro del corazón */}
        <div className="absolute inset-[3px] overflow-hidden">
          <div className="relative h-full w-full rounded-full overflow-hidden">
            <Image
              src="/images/lulaweb-character.jpeg"
              alt="Lulaweb"
              fill
              className={cn(
                "object-cover scale-[1.5] object-top opacity-0 transition-opacity",
                isFavorite ? "opacity-100" : "group-hover:opacity-50",
              )}
            />
          </div>
        </div>
      </div>

      {showLabel && <span className="text-sm font-medium">{isFavorite ? "Guardado" : "Guardar"}</span>}
    </button>
  )
}
