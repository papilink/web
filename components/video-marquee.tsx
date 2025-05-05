"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function VideoMarquee({ videos }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const videoRef = useRef(null)
  const scrollContainerRef = useRef(null)

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : videos.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < videos.length - 1 ? prev + 1 : 0))
  }

  const handleVideoClick = (video) => {
    setActiveVideo(video)
  }

  const handleCloseVideo = () => {
    setActiveVideo(null)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }

  // Scroll to the current video thumbnail
  const scrollToCurrentVideo = (index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const thumbnailWidth = container.querySelector(".video-thumbnail")?.offsetWidth || 0
      const scrollPosition = index * (thumbnailWidth + 16) // 16px is the gap

      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Videos destacados</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </div>
      </div>

      <div ref={scrollContainerRef} className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={cn(
              "video-thumbnail flex-shrink-0 w-72 h-40 relative rounded-lg overflow-hidden cursor-pointer snap-start",
              index === currentIndex && "ring-2 ring-primary",
            )}
            onClick={() => handleVideoClick(video)}
          >
            <Image
              src={video.thumbnail || "/placeholder.svg?height=160&width=288"}
              alt={video.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <div className="bg-white/80 rounded-full p-2">
                <Play className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
              <h3 className="text-white text-sm font-medium truncate">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <Card className="w-full max-w-4xl relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={handleCloseVideo}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>

            <CardContent className="p-0 relative">
              <div className="relative aspect-video">
                <video
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  controls
                  className="w-full h-full"
                  autoPlay
                />
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{activeVideo.title}</h2>
                <p className="text-gray-600">{activeVideo.description}</p>

                {activeVideo.productId && (
                  <Button className="mt-4" onClick={() => (window.location.href = `#product-${activeVideo.productId}`)}>
                    Ver producto
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
