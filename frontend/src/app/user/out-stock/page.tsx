'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
}

export default function SoldOutStock() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3001/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }

        const data = await response.json();

        const mapped: Product[] = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          stock: p.stock
        }));

        const filtered = mapped.filter(product => product.stock === 0);
        setProducts(filtered);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar produto: ${response.status}`);
      }

      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
    <main>
      <h1 className="text-2xl font-bold mb-6 text-sky-600">Produtos Esgotados</h1>

      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <strong>Estoque:</strong> <span>{product.stock}</span>
              <p className="font-medium text-red-600">Esgotado</p>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/user/edit-product/${product.id}`}
                  className="flex-1 text-center py-1 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-1 bg-red-400 text-amber-50 hover:bg-red-500 font-bold cursor-pointer rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link href="/user/new-product">
        <button className="fixed bottom-4 right-4 bg-sky-700 hover:bg-sky-800 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all cursor-pointer">
          <span className="material-icons text-3xl">add</span>
        </button>
      </Link>
    </main>
  );
}
