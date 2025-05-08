"use client"

import { createContext, useState, useContext, useEffect, ReactNode } from "react"

// Crear el contexto
export const FavoritesContext = createContext({
  favorites: [] as string[],
  addFavorite: (productId: string) => {},
  removeFavorite: (productId: string) => {},
  toggleFavorite: (productId: string) => {},
  isFavorite: (productId: string) => false,
})

// Hook personalizado para usar el contexto
export const useFavorites = () => useContext(FavoritesContext)

// Proveedor del contexto
export default function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const storedFavorites = localStorage.getItem("lulaweb-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Error al analizar los favoritos desde localStorage:", error);
        setFavorites([]); // Establecer una lista de favoritos vacía en caso de error
      }
    }
  }, [])

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("lulaweb-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Añadir un producto a favoritos
  const addFavorite = (productId: string) => {
    if (!favorites.includes(productId)) {
      setFavorites([...favorites, productId])
    }
  }

  // Eliminar un producto de favoritos
  const removeFavorite = (productId: string) => {
    setFavorites(favorites.filter((id) => id !== productId))
  }

  // Alternar estado de favorito
  const toggleFavorite = (productId: string) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  // Verificar si un producto está en favoritos
  const isFavorite = (productId: string): boolean => {
    return favorites.includes(productId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
