"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, ShoppingCart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ChatInterface from "@/components/chat-interface"
import HeartIconButton from "@/components/heart-icon-button"
import { useCart } from "@/components/cart-provider"

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOriginal?: number;
  porcentajeDescuento?: number;
  stock: number;
  categoria: string;
  imagen: string;
}

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const { addToCart } = useCart()

  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
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
              <Image
                src={product.imagen || "/placeholder.svg"}
                alt={product.nombre}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain"
              />

              {/* Botón de corazón en la esquina superior derecha */}
              <div className="absolute top-4 left-4">
                <HeartIconButton productId={product.id} size="lg" />
              </div>
            </div>

            <div className="p-6 flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">{product.nombre}</h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-3xl font-bold text-primary">
                    ${typeof product.precio === 'number' ? product.precio.toFixed(2) : '0.00'}
                  </p>
                  {product.precioOriginal && (
                    <p className="text-lg text-muted-foreground line-through">
                      ${product.precioOriginal.toFixed(2)}
                    </p>
                  )}
                  {product.porcentajeDescuento && (
                    <Badge variant="destructive" className="ml-2">
                      -{product.porcentajeDescuento}% OFF
                    </Badge>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Descripción</h3>
                    <p className="text-muted-foreground">{product.descripcion}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Categoría</h3>
                    <p className="text-muted-foreground capitalize">{product.categoria}</p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Stock disponible</h3>
                    <p className="text-muted-foreground">{product.stock} unidades</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    addToCart(product.id)
                    onClose()
                  }}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {product.stock > 0 ? "Agregar al carrito" : "Sin stock"}
                </Button>
                
                <ChatInterface productId={product.id} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
