"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import SiteHeader from "@/components/site-header"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular envío del formulario
    setTimeout(() => {
      toast({
        title: "Mensaje enviado",
        description: "Nos pondremos en contacto contigo pronto",
      })
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsLoading(false)
    }, 1000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Encabezado */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contacto</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes preguntas sobre algún producto? ¿Necesitas más información? Estamos aquí para ayudarte.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Información de contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
                <CardDescription>Encuentra diferentes formas de contactarnos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <Link href="mailto:contacto@lulaweb.com" className="text-sm text-muted-foreground hover:text-primary">
                      contacto@lulaweb.com
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Teléfono</p>
                    <Link href="tel:+1234567890" className="text-sm text-muted-foreground hover:text-primary">
                      (123) 456-7890
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <p className="text-sm text-muted-foreground">
                      Calle Principal 123, Ciudad
                    </p>
                  </div>
                </div>

                <div className="relative h-48 mt-6 rounded-lg overflow-hidden">
                  <Image
                    src="/images/lulaweb-character.jpeg"
                    alt="Ubicación"
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Formulario de contacto */}
            <Card>
              <CardHeader>
                <CardTitle>Envíanos un Mensaje</CardTitle>
                <CardDescription>Completa el formulario y te responderemos lo antes posible</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Tu nombre"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Tu email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Asunto"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Tu mensaje"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar mensaje
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}