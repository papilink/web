"use client"

import { useState, useEffect } from "react"
import { Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

// Simulación de mensajes almacenados (en un sistema real, esto vendría de una base de datos)
const storedMessages = {
  1: [
    { id: 1, sender: "user", name: "Usuario", message: "¿Todavía está disponible?", timestamp: "2023-05-01T14:30:00" },
    {
      id: 2,
      sender: "seller",
      name: "Vendedor",
      message: "Sí, todavía está disponible. ¿Estás interesado?",
      timestamp: "2023-05-01T14:35:00",
    },
  ],
  2: [
    {
      id: 1,
      sender: "user",
      name: "Usuario",
      message: "¿Puedes enviar más fotos de la silla?",
      timestamp: "2023-05-02T10:15:00",
    },
  ],
  3: [],
  4: [],
  5: [],
  6: [],
}

export default function ChatInterface({ productId }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  // Cargar mensajes existentes para este producto
  useEffect(() => {
    if (productId && storedMessages[productId]) {
      setMessages(storedMessages[productId])
    } else {
      setMessages([])
    }
  }, [productId])

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: "user",
      name: "Usuario",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    // Añadir mensaje a la conversación
    const updatedMessages = [...messages, message]
    setMessages(updatedMessages)

    // Actualizar mensajes almacenados (simulación)
    if (storedMessages[productId]) {
      storedMessages[productId] = updatedMessages
    } else {
      storedMessages[productId] = [message]
    }

    // Limpiar campo de entrada
    setNewMessage("")

    // Notificar al usuario
    toast({
      title: "Mensaje enviado",
      description: "Tu pregunta ha sido enviada al vendedor",
    })

    // Simular respuesta automática después de 2 segundos
    if (messages.length === 0) {
      setTimeout(() => {
        const autoResponse = {
          id: updatedMessages.length + 1,
          sender: "seller",
          name: "Vendedor",
          message: "Gracias por tu interés. Te responderé a la brevedad posible.",
          timestamp: new Date().toISOString(),
        }
        setMessages([...updatedMessages, autoResponse])

        // Actualizar mensajes almacenados (simulación)
        storedMessages[productId] = [...updatedMessages, autoResponse]
      }, 2000)
    }
  }

  return (
    <div className="flex flex-col h-[300px] border rounded-lg overflow-hidden">
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-center">
              No hay preguntas sobre este producto.
              <br />
              ¡Sé el primero en preguntar!
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "seller" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary">VD</AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <div className="flex justify-between items-center gap-4 mb-1">
                  <span className="font-medium text-xs">{msg.name}</span>
                  <span className="text-xs opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <p>{msg.message}</p>
              </div>
              {msg.sender === "user" && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="border-t p-2 flex gap-2">
        <Input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Send className="h-4 w-4" />
          <span className="sr-only">Enviar mensaje</span>
        </Button>
      </form>
    </div>
  )
}
