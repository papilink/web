"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight, Play, Pause, X, Volume2, VolumeX } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type Video = {
  id: string | number;
  title: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  productId?: string | number;
}

export default function VideoMarquee({ videos, autoPlay = true, interval = 5000 }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeVideo, setActiveVideo] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const autoPlayTimerRef = useRef(null)

  const startAutoPlay = useCallback(() => {
    if (autoPlay && !activeVideo) {
      autoPlayTimerRef.current = setInterval(() => {
        handleNext()
      }, interval)
    }
  }, [autoPlay, interval, activeVideo])

  const stopAutoPlay = useCallback(() => {
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current)
      autoPlayTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [startAutoPlay, stopAutoPlay])

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev > 0 ? prev - 1 : videos.length - 1
      scrollToCurrentVideo(newIndex)
      return newIndex
    })
    stopAutoPlay()
    startAutoPlay()
  }, [videos.length, stopAutoPlay, startAutoPlay])

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      const newIndex = prev < videos.length - 1 ? prev + 1 : 0
      scrollToCurrentVideo(newIndex)
      return newIndex
    })
    stopAutoPlay()
    startAutoPlay()
  }, [videos.length, stopAutoPlay, startAutoPlay])

  const handleVideoClick = useCallback((video) => {
    setActiveVideo(video)
    stopAutoPlay()
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }, [stopAutoPlay])

  const handleCloseVideo = useCallback(() => {
    setActiveVideo(null)
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
    startAutoPlay()
  }, [startAutoPlay])

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  const scrollToCurrentVideo = useCallback((index) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const thumbnailWidth = container.querySelector(".video-thumbnail")?.offsetWidth || 0
      const scrollPosition = index * (thumbnailWidth + 16)
      
      container.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeVideo) {
        switch (e.key) {
          case "Escape":
            handleCloseVideo()
            break
          case " ":
            e.preventDefault()
            handlePlayPause()
            break
          case "m":
            toggleMute()
            break
        }
      } else {
        switch (e.key) {
          case "ArrowLeft":
            handlePrevious()
            break
          case "ArrowRight":
            handleNext()
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [activeVideo, handleCloseVideo, handlePlayPause, toggleMute, handlePrevious, handleNext])

  // Auto-scroll to current video on mount and index change
  useEffect(() => {
    scrollToCurrentVideo(currentIndex)
  }, [currentIndex, scrollToCurrentVideo])

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Videos destacados</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handlePrevious}
            className="hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleNext}
            className="hover:scale-105 active:scale-95 transition-transform"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Siguiente</span>
          </Button>
        </div>
      </div>

      <div 
        ref={scrollContainerRef} 
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide relative scroll-smooth"
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            className={cn(
              "video-thumbnail flex-shrink-0 w-72 h-40 relative rounded-lg overflow-hidden cursor-pointer snap-start transform transition-all duration-300",
              index === currentIndex && "ring-2 ring-primary scale-105",
              "hover:scale-105 hover:shadow-xl"
            )}
            onClick={() => handleVideoClick(video)}
          >
            <Image
              src={video.thumbnail || "/images/lava10.jpg"}
              alt={video.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transform transition-transform duration-300 hover:scale-110"
              priority={index === currentIndex}
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity duration-300 hover:bg-black/50">
              <div className="bg-white/80 rounded-full p-2 transform transition-transform duration-300 hover:scale-110">
                <Play className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <h3 className="text-white text-sm font-medium truncate">{video.title}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Video modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
          <Card className="w-full max-w-4xl relative animate-in zoom-in-50 duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70 transition-colors"
              onClick={handleCloseVideo}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cerrar</span>
            </Button>

            <CardContent className="p-0 relative">
              <div className="relative aspect-video group">
                <video
                  ref={videoRef}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  className="w-full h-full"
                  autoPlay
                  playsInline
                  muted={isMuted}
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6" />
                      ) : (
                        <Play className="h-6 w-6" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? (
                        <VolumeX className="h-6 w-6" />
                      ) : (
                        <Volume2 className="h-6 w-6" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold">{activeVideo.title}</h2>
                <p className="text-gray-600">{activeVideo.description}</p>

                {activeVideo.productId && (
                  <Button 
                    className="mt-4 hover:scale-105 active:scale-95 transition-transform"
                    onClick={() => {
                      handleCloseVideo()
                      const element = document.getElementById(`product-${activeVideo.productId}`)
                      element?.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    Ver producto relacionado
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
