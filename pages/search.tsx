import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  // Añade más propiedades según tu modelo de datos
}

export default function SearchResults() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (q) {
      searchProducts(q as string);
    }
  }, [q]);

  const searchProducts = async (query: string) => {
    try {
      setLoading(true);
      // Reemplaza esta URL con tu endpoint real de búsqueda
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error en la búsqueda:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Resultados para: {q}</h1>
      
      {loading ? (
        <p>Cargando resultados...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <h2 className="font-bold">{product.name}</h2>
              <p className="text-lg">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}