"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function KeyboardShortcuts() {
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Atajo Ctrl + Space para acceso administrativo
      if (e.ctrlKey && e.code === "Space") {
        e.preventDefault()
        
        // Mostrar toast de confirmación
        toast({
          title: "Accediendo al panel administrativo",
          description: "Redirigiendo a la página de login...",
          duration: 2000,
        })
        
        // Pequeño delay para mostrar el toast antes de redirigir
        setTimeout(() => {
          router.push("/login")
        }, 500)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [router, toast])

  return null
}