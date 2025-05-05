"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Volume2, VolumeX } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

export default function ChatOnlineButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [isSoundEnabled, setIsSoundEnabled] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)
  const pathname = usePathname()
  const { toast } = useToast()

  // Reset chat state when navigating to a different page
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false)
    }
  }, [pathname])

  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Play sound when chat is opened for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0 && isSoundEnabled) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch((error) => {
          console.error("Error playing sound:", error)
        })
      }

      // Add initial welcome message after a short delay
      const timer = setTimeout(() => {
        setMessages([
          {
            id: 1,
            sender: "agent",
            name: "Soporte",
            message: "¡Hola! ¿En qué puedo ayudarte hoy?",
            timestamp: new Date().toISOString(),
          },
        ])
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [isOpen, messages.length, isSoundEnabled])

  // Show notification when new message arrives and chat is closed
  useEffect(() => {
    if (messages.length > 0 && !isOpen && messages[messages.length - 1].sender === "agent") {
      setHasNewMessage(true)
    } else {
      setHasNewMessage(false)
    }
  }, [messages, isOpen])

  // Simulate agent typing
  const simulateAgentTyping = () => {
    setIsTyping(true)

    // Random typing time between 1.5 and 3 seconds
    const typingTime = Math.floor(Math.random() * 1500) + 1500

    setTimeout(() => {
      setIsTyping(false)

      // Add agent response
      const responses = [
        "Claro, puedo ayudarte con eso.",
        "Gracias por tu pregunta. Déjame verificar esa información.",
        "¿Hay algo más en lo que pueda ayudarte?",
        "Ese producto está disponible actualmente.",
        "Puedes encontrar más detalles en la descripción del producto.",
        "¿Te gustaría que te muestre productos similares?",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          sender: "agent",
          name: "Soporte",
          message: randomResponse,
          timestamp: new Date().toISOString(),
        },
      ])

      // Play notification sound if enabled
      if (isSoundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.volume = 0.5
        audioRef.current.play().catch((error) => {
          console.error("Error playing sound:", error)
        })
      }
    }, typingTime)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: "user",
      name: "Tú",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // Simulate agent typing after a short delay
    setTimeout(simulateAgentTyping, 500)
  }

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled)

    toast({
      title: isSoundEnabled ? "Sonido desactivado" : "Sonido activado",
      description: isSoundEnabled
        ? "Las notificaciones de sonido han sido desactivadas"
        : "Las notificaciones de sonido han sido activadas",
    })
  }

  return (
    <>
      {/* Audio element for notification sound */}
      <audio ref={audioRef} src="/sounds/chat-call.mp3" />

      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative"
            >
              <Button onClick={() => setIsOpen(true)} size="lg" className="h-14 w-14 rounded-full shadow-lg">
                <MessageCircle className="h-6 w-6" />
                <span className="sr-only">Abrir chat</span>
              </Button>

              {/* Online indicator */}
              <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />

              {/* New message indicator */}
              {hasNewMessage && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  1
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 rounded-lg shadow-xl bg-white overflow-hidden border"
          >
            {/* Chat header */}
            <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Avatar className="h-8 w-8 border-2 border-primary-foreground">
                    <AvatarFallback className="bg-primary-foreground text-primary">S</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white" />
                </div>
                <div>
                  <h3 className="font-medium text-sm">Soporte Lulaweb</h3>
                  <p className="text-xs opacity-90">En línea</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground opacity-80 hover:opacity-100 hover:bg-primary-foreground/10"
                  onClick={toggleSound}
                >
                  {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <span className="sr-only">{isSoundEnabled ? "Desactivar sonido" : "Activar sonido"}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-primary-foreground opacity-80 hover:opacity-100 hover:bg-primary-foreground/10"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Cerrar chat</span>
                </Button>
              </div>
            </div>

            {/* Chat messages */}
            <div className="h-80 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2 max-w-[85%] ${msg.sender === "user" ? "self-end" : "self-start"}`}
                >
                  {msg.sender === "agent" && (
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarFallback className="bg-primary/10 text-primary">S</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 ${
                      msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-[10px] opacity-70 mt-1 text-right">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 self-start">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarFallback className="bg-primary/10 text-primary">S</AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex gap-1 items-center">
                      <div
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat input */}
            <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
              <Input
                type="text"
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon" className="shrink-0">
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar mensaje</span>
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
