"use client"

import { createContext, useContext, useState } from "react"

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  category: string
  stock: number
}

// Datos iniciales de productos (en un sistema real, esto vendría de una API)
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Lavarropas Samsung",
    price: 450.99,
    description: "Lavarropas automático Samsung con múltiples programas de lavado. Excelente estado.",
    image: "/images/lava10.jpg",
    category: "lavarropas",
    stock: 5
  },
  {
    id: 2,
    name: "Notebook Lenovo",
    price: 620.0,
    description: "Notebook Lenovo ThinkPad en perfecto estado. Ideal para trabajo y estudio.",
    image: "/images/lava10.jpg",
    category: "notebooks",
    stock: 3
  },
  {
    id: 3,
    name: "PC de Escritorio HP",
    price: 585.5,
    description: "Computadora de escritorio HP con monitor incluido. Lista para usar.",
    image: "/images/lava10.jpg",
    category: "computadora PC",
    stock: 2
  },
  {
    id: 4,
    name: "Ventilador de Pie",
    price: 35.25,
    description: "Ventilador de pie con 3 velocidades y oscilación. Perfecto para el verano.",
    image: "/images/lava10.jpg",
    category: "varios",
    stock: 10
  },
  {
    id: 5,
    name: "Monitor Gaming",
    price: 240.0,
    description: "Monitor gaming de 24 pulgadas, 144Hz. Ideal para juegos.",
    image: "/images/lava10.jpg",
    category: "computadora PC",
    stock: 1
  }
]

interface ProductsContextType {
  products: Product[]
  updateProduct: (id: number, updates: Partial<Product>) => void
  addProduct: (product: Omit<Product, "id">) => void
  removeProduct: (id: number) => void
  searchProducts: (query: string) => Product[]
  filteredProducts: Product[]
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined)

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error("useProducts debe usarse dentro de un ProductsProvider")
  }
  return context
}

export default function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [searchQuery, setSearchQuery] = useState("")

  const searchProducts = (query: string) => {
    const normalizedQuery = query.toLowerCase().trim()
    if (!normalizedQuery) return products

    return products.filter(product => {
      const inName = product.name.toLowerCase().includes(normalizedQuery)
      const inDescription = product.description.toLowerCase().includes(normalizedQuery)
      const inCategory = product.category?.toLowerCase().includes(normalizedQuery)
      return inName || inDescription || inCategory
    })
  }

  const filteredProducts = searchProducts(searchQuery)

  const updateProduct = (id: number, updates: Partial<Product>) => {
    setProducts(currentProducts =>
      currentProducts.map(product =>
        product.id === id
          ? { ...product, ...updates }
          : product
      )
    )
  }

  const addProduct = (product: Omit<Product, "id">) => {
    setProducts(currentProducts => [
      ...currentProducts,
      {
        ...product,
        id: Math.max(0, ...currentProducts.map(p => p.id)) + 1
      }
    ])
  }

  const removeProduct = (id: number) => {
    setProducts(currentProducts =>
      currentProducts.filter(product => product.id !== id)
    )
  }

  return (
    <ProductsContext.Provider value={{
      products,
      updateProduct,
      addProduct,
      removeProduct,
      searchProducts,
      filteredProducts,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </ProductsContext.Provider>
  )
}