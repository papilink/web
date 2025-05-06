'use client'

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { exportDatabase } from "@/lib/export-actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type TableSelection = {
  products: boolean
  messages: boolean
  users: boolean
}

export default function DatabasePage() {
  const { toast } = useToast()
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormat, setExportFormat] = useState("json")
  const [selectedTables, setSelectedTables] = useState<TableSelection>({
    products: true,
    messages: true,
    users: true,
  })

  const handleCheckboxChange = (table: keyof TableSelection) => {
    setSelectedTables({
      ...selectedTables,
      [table]: !selectedTables[table],
    })
  }

  const handleExport = async () => {
    const selectedTablesList = Object.entries(selectedTables)
      .filter(([_, selected]) => selected)
      .map(([table]) => table)

    if (selectedTablesList.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos una tabla para exportar",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const result = await exportDatabase({
        format: exportFormat,
        tables: selectedTablesList,
      })

      let blobContent;
      let mimeType;

      if (exportFormat === "json") {
        // Asegurarse de que el resultado sea una cadena JSON válida
        blobContent = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
        mimeType = "application/json";
      } else {
        // Para CSV, usar el resultado directamente
        blobContent = result;
        mimeType = "text/csv";
      }

      // Crear un blob con el contenido exportado
      const blob = new Blob([blobContent], { type: mimeType });

      // Crear una URL para el blob
      const url = URL.createObjectURL(blob)

      // Crear un elemento <a> temporal para la descarga
      const link = document.createElement("a")
      link.href = url
      link.download = `database-export.${exportFormat}`
      document.body.appendChild(link)
      link.click()

      // Limpiar
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast({
        title: "Éxito",
        description: "Base de datos exportada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al exportar la base de datos",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Exportar Base de Datos</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Formato de exportación</h2>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
          </select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Tablas a exportar</h2>
          <div className="space-y-2">
            {Object.entries(selectedTables).map(([table, selected]) => (
              <label key={table} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleCheckboxChange(table as keyof TableSelection)}
                  className="form-checkbox"
                />
                <span>{table}</span>
              </label>
            ))}
          </div>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              disabled={isExporting}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isExporting ? "Exportando..." : "Exportar"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Desea continuar con la iteración?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción exportará las tablas seleccionadas de la base de datos. 
                Asegúrese de haber seleccionado todas las tablas necesarias.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleExport}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
