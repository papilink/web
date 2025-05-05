"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download, FileJson, FileSpreadsheet, ArrowLeft, Database } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exportDatabase } from "@/lib/export-actions"

export default function DatabasePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")
  const [selectedTables, setSelectedTables] = useState({
    products: true,
    messages: true,
    users: true,
  })

  const handleCheckboxChange = (table) => {
    setSelectedTables({
      ...selectedTables,
      [table]: !selectedTables[table],
    })
  }

  const handleExport = async () => {
    // Verificar que al menos una tabla esté seleccionada
    if (!Object.values(selectedTables).some((selected) => selected)) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos una tabla para exportar",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      // Llamar a la función de exportación
      const data = await exportDatabase({
        format: exportFormat,
        tables: Object.keys(selectedTables).filter((table) => selectedTables[table]),
      })

      // Crear un blob con los datos
      const blob = new Blob([data], {
        type: exportFormat === "json" ? "application/json" : "text/csv",
      })

      // Crear URL para el blob
      const url = window.URL.createObjectURL(blob)

      // Crear elemento de enlace para la descarga
      const a = document.createElement("a")
      a.href = url
      a.download = `lulaweb-export-${new Date().toISOString().split("T")[0]}.${exportFormat}`
      document.body.appendChild(a)
      a.click()

      // Limpiar
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Exportación exitosa",
        description: `Los datos han sido exportados en formato ${exportFormat.toUpperCase()}`,
      })
    } catch (error) {
      toast({
        title: "Error en la exportación",
        description: error.message || "Ocurrió un error al exportar los datos",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.push("/admin")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Volver</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Base de Datos</h1>
            <p className="text-gray-600">Exporta los datos del sistema para respaldo o análisis</p>
          </div>
        </header>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <CardTitle>Exportar Base de Datos</CardTitle>
            </div>
            <CardDescription>Selecciona las tablas que deseas exportar y el formato de archivo deseado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Tablas a exportar</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="products"
                      checked={selectedTables.products}
                      onCheckedChange={() => handleCheckboxChange("products")}
                    />
                    <Label htmlFor="products">Productos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="messages"
                      checked={selectedTables.messages}
                      onCheckedChange={() => handleCheckboxChange("messages")}
                    />
                    <Label htmlFor="messages">Mensajes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="users"
                      checked={selectedTables.users}
                      onCheckedChange={() => handleCheckboxChange("users")}
                    />
                    <Label htmlFor="users">Usuarios</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Formato de exportación</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger id="format" className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Selecciona un formato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center gap-2">
                        <FileJson className="h-4 w-4" />
                        <span>JSON</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4" />
                        <span>CSV</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleExport} disabled={isExporting} className="w-full sm:w-auto">
              {isExporting ? (
                "Exportando..."
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar datos
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Base de Datos</CardTitle>
            <CardDescription>Estadísticas y detalles de los datos almacenados</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stats">
              <TabsList className="mb-4">
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                <TabsTrigger value="structure">Estructura</TabsTrigger>
              </TabsList>

              <TabsContent value="stats">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Productos</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Mensajes</p>
                    <p className="text-2xl font-bold">5</p>
                  </div>
                  <div className="bg-muted rounded-lg p-4">
                    <p className="text-sm font-medium text-muted-foreground mb-1">Usuarios</p>
                    <p className="text-2xl font-bold">1</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Última actualización: {new Date().toLocaleDateString()}
                </p>
              </TabsContent>

              <TabsContent value="structure">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tabla: Productos</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs">
                        id: number
                        <br />
                        name: string
                        <br />
                        price: number
                        <br />
                        description: string
                        <br />
                        image: string
                      </code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tabla: Mensajes</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs">
                        id: number
                        <br />
                        productId: number
                        <br />
                        sender: string
                        <br />
                        name: string
                        <br />
                        message: string
                        <br />
                        timestamp: string
                      </code>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tabla: Usuarios</h3>
                    <div className="bg-muted p-3 rounded-md">
                      <code className="text-xs">
                        id: number
                        <br />
                        username: string
                        <br />
                        password: string (hash)
                        <br />
                        role: string
                      </code>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
