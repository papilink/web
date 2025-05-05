"use client"

import { useState } from "react"
import { Send, MessageSquare } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

// Simulación de conversaciones (en un sistema real, esto vendría de una base de datos)
const initialConversations = [
  {
    id: 1,
    productId: 1,
    productName: "Lámpara Vintage",
    lastMessage: "Sí, todavía está disponible. ¿Estás interesado?",
    timestamp: "2023-05-01T14:35:00",
    unread: false,
    messages: [
      { id: 1, sender: "user", name: "Carlos", message: "¿Todavía está disponible?", timestamp: "2023-05-01T14:30:00" },
      {
        id: 2,
        sender: "seller",
        name: "Vendedor",
        message: "Sí, todavía está disponible. ¿Estás interesado?",
        timestamp: "2023-05-01T14:35:00",
      },
    ],
  },
  {
    id: 2,
    productId: 2,
    productName: "Silla de Diseñador",
    lastMessage: "¿Puedes enviar más fotos de la silla?",
    timestamp: "2023-05-02T10:15:00",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "user",
        name: "María",
        message: "¿Puedes enviar más fotos de la silla?",
        timestamp: "2023-05-02T10:15:00",
      },
    ],
  },
  {
    id: 3,
    productId: 3,
    productName: "Mesa de Centro",
    lastMessage: "¿Cuáles son las dimensiones exactas?",
    timestamp: "2023-05-03T16:20:00",
    unread: true,
    messages: [
      {
        id: 1,
        sender: "user",
        name: "Juan",
        message: "¿Cuáles son las dimensiones exactas?",
        timestamp: "2023-05-03T16:20:00",
      },
    ],
  },
]

export default function AdminChatInterface() {
  const [conversations, setConversations] = useState(initialConversations)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const { toast } = useToast()

  const handleSelectConversation = (conversation) => {
    // Marcar como leído al seleccionar
    if (conversation.unread) {
      const updatedConversations = conversations.map((conv) =>
        conv.id === conversation.id ? { ...conv, unread: false } : conv,
      )
      setConversations(updatedConversations)
    }
    setSelectedConversation(conversation)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !selectedConversation) return

    const message = {
      id: selectedConversation.messages.length + 1,
      sender: "seller",
      name: "Vendedor",
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    // Añadir mensaje a la conversación
    const updatedMessages = [...selectedConversation.messages, message]

    // Actualizar la conversación seleccionada
    const updatedSelectedConversation = {
      ...selectedConversation,
      messages: updatedMessages,
      lastMessage: newMessage.trim(),
      timestamp: new Date().toISOString(),
    }

    // Actualizar la lista de conversaciones
    const updatedConversations = conversations.map((conv) =>
      conv.id === selectedConversation.id ? updatedSelectedConversation : conv,
    )

    setConversations(updatedConversations)
    setSelectedConversation(updatedSelectedConversation)
    setNewMessage("")

    toast({
      title: "Mensaje enviado",
      description: "Tu respuesta ha sido enviada al cliente",
    })
  }

  return (
    <div className="flex h-[600px] border rounded-lg overflow-hidden">
      {/* Lista de conversaciones */}
      <div className="w-1/3 border-r">
        <div className="p-4 border-b">
          <h3 className="font-medium">Conversaciones</h3>
        </div>
        <ScrollArea className="h-[calc(600px-57px)]">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedConversation?.id === conversation.id ? "bg-gray-100" : ""
              }`}
              onClick={() => handleSelectConversation(conversation)}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium truncate">{conversation.productName}</h4>
                <div className="flex items-center">
                  {conversation.unread && <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>}
                  <span className="text-xs text-gray-500">{new Date(conversation.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b">
              <h3 className="font-medium">{selectedConversation.productName}</h3>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${msg.sender === "seller" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.sender === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{msg.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        msg.sender === "seller" ? "bg-primary text-primary-foreground" : "bg-muted"
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
                    {msg.sender === "seller" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary">VD</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
              <Input
                type="text"
                placeholder="Escribe tu respuesta..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
                <span className="sr-only">Enviar mensaje</span>
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p>Selecciona una conversación para ver los mensajes</p>
          </div>
        )}
      </div>
    </div>
  )
}
