import { useRouter } from 'next/router'

export default function CategoriaPage() {
  const router = useRouter()
  const { categoria } = router.query

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Productos en categoría: {categoria}
      </h1>
      {/* Aquí va tu lista de productos filtrada por categoría */}
    </div>
  )
}