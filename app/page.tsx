"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import ProductModal from "@/components/product-modal"
import { useToast } from "@/hooks/use-toast"
import VideoMarquee from "@/components/video-marquee"
import HeartIconButton from "@/components/heart-icon-button"
import SiteHeader from "@/components/site-header"
import { useFavorites } from "@/components/favorites-provider"

// Datos de ejemplo para los productos
const initialProducts = [
  {
    id: 1,
    name: "Lámpara Vintage",
    price: 45.99,
    description:
      "Lámpara de mesa vintage en excelente estado. Perfecta para dar un toque elegante a cualquier habitación.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 2,
    name: "Silla de Diseñador",
    price: 120.0,
    description: "Silla de diseñador en madera y cuero. Muy cómoda y en perfecto estado.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 3,
    name: "Mesa de Centro",
    price: 85.5,
    description: "Mesa de centro de cristal con base de madera. Elegante y funcional.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 4,
    name: "Jarrón Decorativo",
    price: 35.25,
    description: "Jarrón decorativo de cerámica pintado a mano. Pieza única.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 5,
    name: "Cuadro Abstracto",
    price: 75.0,
    description: "Cuadro abstracto con marco de madera. Colores vibrantes que darán vida a tu espacio.",
    image: "/placeholder.svg?height=400&width=400",
  },
  {
    id: 6,
    name: "Reloj de Pared",
    price: 40.0,
    description: "Reloj de pared estilo industrial. Funciona perfectamente.",
    image: "/placeholder.svg?height=400&width=400",
  },
]

// Datos de ejemplo para los videos
const initialVideos = [
  {
    id: 1,
    title: "Lámpara Vintage - Vista 360°",
    description: "Mira todos los detalles de nuestra lámpara vintage en este video de 360 grados.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product1.mp4",
    productId: 1,
  },
  {
    id: 2,
    title: "Silla de Diseñador - Demostración",
    description: "Observa la calidad y el diseño de nuestra silla de diseñador exclusiva.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product2.mp4",
    productId: 2,
  },
  {
    id: 3,
    title: "Mesa de Centro - Características",
    description: "Conoce todas las características de nuestra elegante mesa de centro.",
    thumbnail: "/placeholder.svg?height=160&width=288",
    videoUrl: "/videos/sample-product3.mp4",
    productId: 3,
  },
]

export default function Home() {
  const [products, setProducts] = useState(initialProducts)
  const [videos, setVideos] = useState(initialVideos)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()
  const { toggleFavorite, isFavorite } = useFavorites()

  // Función para manejar la combinación de teclas Ctrl + Espacio
  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.code === "Space") {
      e.preventDefault()
      // Redirigir a la página de login
      window.location.href = "/login"
    }
  }

  // Efecto para agregar el event listener de teclado
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    // Mostrar un toast con instrucciones para el admin
    toast({
      title: "Acceso Administrativo",
      description: "Presiona Ctrl + Espacio para acceder al panel de administración",
      duration: 5000,
    })

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const openProductModal = (product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const closeProductModal = () => {
    setIsModalOpen(false)
    setSelectedProduct(null)
  }

  const handleToggleFavorite = (productId) => {
    toggleFavorite(productId)

    if (!isFavorite(productId)) {
      toast({
        title: "Añadido a favoritos",
        description: "El producto ha sido añadido a tus favoritos",
      })
    } else {
      toast({
        title: "Eliminado de favoritos",
        description: "El producto ha sido eliminado de tus favoritos",
      })
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">Lulaweb</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre piezas únicas en nuestra venta de garage con estilo
            </p>
          </header>

          {/* Video Marquee Section */}
          <section className="mb-12">
            <VideoMarquee videos={videos} />
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                id={`product-${product.id}`}
                className="group relative bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden" onClick={() => openProductModal(product)}>
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Video indicator if product has video */}
                  {videos.some((video) => video.productId === product.id) && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                      Video
                    </div>
                  )}

                  {/* Heart icon button */}
                  <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                    <HeartIconButton productId={product.id} onToggle={() => handleToggleFavorite(product.id)} />
                  </div>
                </div>
                <div className="p-4" onClick={() => openProductModal(product)}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-700 font-medium">${product.price.toFixed(2)}</p>
                </div>
                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1)] rounded-lg pointer-events-none"></div>
              </div>
            ))}
          </div>
        </div>

        {isModalOpen && selectedProduct && (
          <ProductModal product={selectedProduct} isOpen={isModalOpen} onClose={closeProductModal} />
        )}
      </main>
    </>
  )
}
