"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (productId: number) => void
  removeFromCart: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: number) => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart debe usarse dentro de un CartProvider")
  }
  return context
}

export default function CartProvider({ children }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const { toast } = useToast()

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem("lulaweb-cart")
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage:", error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem("lulaweb-cart", JSON.stringify(cart))
  }, [cart])

  const addToCart = (productId: number) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.id === productId)
      if (existingItem) {
        return currentCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...currentCart, { id: productId, quantity: 1 }]
    })
    toast({
      title: "Producto añadido",
      description: "El producto ha sido añadido al carrito"
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId))
    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
      variant: "destructive"
    })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId)
      return
    }
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    toast({
      title: "Carrito vaciado",
      description: "Se han eliminado todos los productos del carrito",
      variant: "destructive"
    })
  }

  const getItemQuantity = (productId: number) => {
    return cart.find(item => item.id === productId)?.quantity || 0
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
      getTotalItems
    }}>
      {children}
    </CartContext.Provider>
  )
}