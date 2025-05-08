"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  nombre: string
  descripcion: string
  precio: number
  stock: number
  categoria: string
  imagen: string
}

interface ProductsContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product>
  deleteProduct: (id: string) => Promise<void>
  getProduct: (id: string) => Promise<Product>
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductsProvider")
  }
  return context
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000

export default function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const { toast } = useToast()

  const fetchProducts = useCallback(async (retryAttempt = 0) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/api/productos`);
      
      if (!response.ok) {
        throw new Error(`Error al cargar productos: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      
      if (!Array.isArray(data)) {
        throw new Error('El formato de datos recibido no es válido')
      }

      const validProducts = data.filter(isValidProduct)
      setProducts(validProducts)
      setRetryCount(0)
    } catch (error) {
      console.error('Error al cargar productos:', error)
      setError(error instanceof Error ? error.message : 'Error desconocido')

      if (retryAttempt < MAX_RETRIES) {
        setTimeout(() => {
          setRetryCount(retryAttempt + 1)
          fetchProducts(retryAttempt + 1)
        }, RETRY_DELAY)
      } else {
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos después de varios intentos. Por favor, recarga la página.",
          variant: "destructive",
        })
      }
    } finally {
      if (retryCount === retryAttempt) {
        setLoading(false)
      }
    }
  }, [toast])

  const addProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
    try {
      const response = await fetch('/api/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al crear el producto')
      }

      const newProduct = await response.json()
      setProducts(current => [...current, newProduct])
      return newProduct
    } catch (error) {
      console.error('Error al añadir producto:', error)
      throw error
    }
  }

  const updateProduct = async (id: string, product: Partial<Product>): Promise<Product> => {
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al actualizar el producto')
      }

      const updatedProduct = await response.json()
      setProducts(current =>
        current.map(p => p.id === id ? updatedProduct : p)
      )
      return updatedProduct
    } catch (error) {
      console.error('Error al actualizar producto:', error)
      throw error
    }
  }

  const deleteProduct = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/productos?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar el producto')
      }

      setProducts(current => current.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error al eliminar producto:', error)
      throw error
    }
  }

  const getProduct = async (id: string): Promise<Product> => {
    try {
      const response = await fetch(`/api/productos?id=${id}`)

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al obtener el producto')
      }

      return await response.json()
    } catch (error) {
      console.error('Error al obtener producto:', error)
      throw error
    }
  }

  const isValidProduct = (product: any): product is Product => {
    return (
      typeof product.id === 'string' &&
      typeof product.nombre === 'string' &&
      typeof product.descripcion === 'string' &&
      typeof product.precio === 'number' &&
      typeof product.stock === 'number' &&
      typeof product.categoria === 'string' &&
      typeof product.imagen === 'string'
    )
  }

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return (
    <ProductsContext.Provider value={{
      products,
      loading,
      error,
      refreshProducts: () => fetchProducts(0),
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct
    }}>
      {children}
    </ProductsContext.Provider>
  )
}