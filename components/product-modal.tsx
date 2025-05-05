"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ChatInterface from "@/components/chat-interface"
import HeartIconButton from "@/components/heart-icon-button"

export default function ProductModal({ product, isOpen, onClose }) {
  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 z-0" onClick={onClose} aria-hidden="true" />

      <Card className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl">
        <Button variant="ghost" size="icon" className="absolute right-4 top-4 z-10" onClick={onClose}>
          <X className="h-5 w-5" />
          <span className="sr-only">Cerrar</span>
        </Button>

        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative h-[300px] md:h-[500px] bg-gray-100">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />

              {/* Botón de corazón en la esquina superior derecha */}
              <div className="absolute top-4 left-4">
                <HeartIconButton productId={product.id} size="lg" />
              </div>
            </div>

            <div className="p-6 md:p-8 flex flex-col">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <p className="text-2xl font-semibold text-gray-900 mb-6">${product.price.toFixed(2)}</p>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-2">Descripción</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>

              <div className="mt-auto">
                <Button className="w-full" size="lg">
                  Contactar para comprar
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium mb-4">Preguntas sobre este producto</h3>
                <ChatInterface productId={product.id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
