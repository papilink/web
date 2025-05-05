"use client"

import { createContext, useState, useContext, useEffect } from "react"

// Crear el contexto
export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: (productId) => {},
  removeFavorite: (productId) => {},
  toggleFavorite: (productId) => {},
  isFavorite: (productId) => false,
})

// Hook personalizado para usar el contexto
export const useFavorites = () => useContext(FavoritesContext)

// Proveedor del contexto
export default function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

  // Cargar favoritos del localStorage al iniciar
  useEffect(() => {
    const storedFavorites = localStorage.getItem("lulaweb-favorites")
    if (storedFavorites) {
      try {
        setFavorites(JSON.parse(storedFavorites))
      } catch (error) {
        console.error("Error parsing favorites from localStorage:", error)
      }
    }
  }, [])

  // Guardar favoritos en localStorage cuando cambien
  useEffect(() => {
    localStorage.setItem("lulaweb-favorites", JSON.stringify(favorites))
  }, [favorites])

  // Añadir un producto a favoritos
  const addFavorite = (productId) => {
    if (!favorites.includes(productId)) {
      setFavorites([...favorites, productId])
    }
  }

  // Eliminar un producto de favoritos
  const removeFavorite = (productId) => {
    setFavorites(favorites.filter((id) => id !== productId))
  }

  // Alternar estado de favorito
  const toggleFavorite = (productId) => {
    if (favorites.includes(productId)) {
      removeFavorite(productId)
    } else {
      addFavorite(productId)
    }
  }

  // Verificar si un producto está en favoritos
  const isFavorite = (productId) => {
    return favorites.includes(productId)
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}
