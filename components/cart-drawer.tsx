"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { X, Minus, Plus, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCart } from "@/components/cart-provider"
import { useProducts } from "@/components/products-provider"

interface CartDrawerProps {
  onClose: () => void;
}

export default function CartDrawer({ onClose }: CartDrawerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, removeFromCart, updateQuantity, getTotalItems, clearCart } = useCart()
  const { products } = useProducts()

  // Efecto de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true)
    }, 50)
    return () => clearTimeout(timer)
  }, [])

  // Calcular el total
  const cartProducts = cart.map(item => {
    const product = products.find(p => p.id === item.id)
    return {
      ...item,
      product
    }
  }).filter(item => item.product)

  const total = cartProducts.reduce(
    (sum, item) => sum + (item.product?.precio || 0) * item.quantity,
    0
  )

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(onClose, 300)
  }

  // Si el carrito está vacío
  if (cartProducts.length === 0) {
    return (
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-xl transform transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } animate-in slide-in-from-right`}
      >
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="relative h-20 w-20 mb-4">
            <ShoppingBag className="h-full w-full text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Tu carrito está vacío</h3>
          <p className="text-gray-500 mb-6">
            Agrega productos a tu carrito haciendo clic en el botón "Agregar al carrito" en cada producto.
          </p>
          <Button onClick={handleClose}>Explorar productos</Button>
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
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Mi Carrito</h2>
          <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
            {getTotalItems()} {getTotalItems() === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            Vaciar
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-73px-80px)]">
        <div className="p-4 space-y-4">
          {cartProducts.map((item, index) => (
            <div
              key={item.product?.id}
              className="flex gap-4 p-3 rounded-lg border hover:bg-gray-50 transition-smooth animate-in fade-in-50 slide-in-from-right"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                <Image
                  src={item.product?.imagen || "/placeholder.svg"}
                  alt={item.product?.nombre || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, 80px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">{item.product?.nombre}</h3>
                <p className="text-sm text-gray-500">${item.product?.precio.toFixed(2)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= (item.product?.stock || 0)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => removeFromCart(item.id)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Eliminar</span>
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="flex items-center justify-between mb-4">
          <span className="text-base font-medium">Total</span>
          <span className="text-2xl font-semibold">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full" size="lg">
          Proceder al pago
        </Button>
      </div>
    </div>
  )
}