// Datos de ejemplo para los productos
const products = [
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
]

// Datos de ejemplo para los mensajes
const messages = [
  {
    id: 1,
    productId: 1,
    conversations: [
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
    conversations: [
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
    conversations: [
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

// Datos de ejemplo para los usuarios
const users = [
  {
    id: 1,
    username: "admin",
    // En un sistema real, esto sería un hash seguro
    password: "admin123_hash",
    role: "admin",
  },
]

// Función para convertir datos a formato CSV
function convertToCSV(data) {
  if (data.length === 0) return ""

  // Obtener encabezados
  const headers = Object.keys(data[0])
  const headerRow = headers.join(",")

  // Convertir cada objeto a una fila CSV
  const rows = data.map((item) => {
    return headers
      .map((header) => {
        let value = item[header]
        // Manejar valores especiales
        if (value === null || value === undefined) return ""
        if (typeof value === "object") value = JSON.stringify(value)
        // Escapar comillas y envolver en comillas si es necesario
        if (typeof value === "string") {
          value = value.replace(/"/g, '""')
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            value = `"${value}"`
          }
        }
        return value
      })
      .join(",")
  })

  return [headerRow, ...rows].join("\n")
}

// Función para exportar la base de datos (versión cliente)
export function exportDatabase({ format, tables }) {
  try {
    // Recopilar los datos solicitados
    const data = {}

    if (tables.includes("products")) {
      data.products = products
    }

    if (tables.includes("messages")) {
      data.messages = messages
    }

    if (tables.includes("users")) {
      data.users = users.map(({ password, ...user }) => ({
        ...user,
        password: "[PROTECTED]",
      }))
    }

    // Validar que haya datos para exportar
    if (Object.keys(data).length === 0) {
      throw new Error("No hay datos para exportar")
    }

    // Convertir al formato solicitado
    if (format === "json") {
      // Asegurarse de que los datos sean JSON válido
      try {
        const jsonString = JSON.stringify(data, null, 2)
        // Validar que sea JSON válido
        try {
          JSON.parse(jsonString)
        } catch (error) {
          console.error("Error al analizar la cadena JSON:", error)
          console.error("Cadena JSON generada:", jsonString); // Agregar registro para depuración
          throw new Error("JSON inválido proporcionado")
        }
        return Promise.resolve(jsonString)
      } catch (jsonError) {
        console.error("Error al generar JSON válido:", jsonError)
        throw new Error("Error al generar JSON válido")
      }
    } else if (format === "csv") {
      let csvContent = ""
      
      for (const table of Object.keys(data)) {
        if (data[table].length > 0) {
          csvContent += `# ${table}\n`
          csvContent += convertToCSV(data[table])
          csvContent += "\n\n"
        }
      }
      
      return Promise.resolve(csvContent)
    }

    return Promise.reject(new Error("Formato no soportado"))
  } catch (error) {
    console.error("Error al exportar la base de datos:", error)
    return Promise.reject(error)
  }
}
