'use client'

import SideBar from "@/components/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      const token = await localStorage.getItem('token');
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
        const mapped = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          stock: p.stock
        }));
        setProducts(mapped);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto.");
      }

      setProducts((prev) => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir o produto.");
    }
  }

  return (
    <div className="flex">
      <SideBar />
      <main className="ml-16 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Estoque</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <strong>Estoque:</strong> <span>{product.stock}</span>
              <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'Disponível' : 'Esgotado'}
              </p>

              <div className="mt-5 flex gap-3">
                <Link
                  href={`/user/edit-product/${product.id}`}
                  className="flex-1 text-center py-1  bg-blue-500 hover:bg-blue-600 text-white font-bold rounded"
                >
                  Editar
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 py-1 bg-red-400  text-amber-50 hover:bg-red-500  font-bold cursor-pointer rounded"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>

        <Link href="/user/new-product">
          <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all cursor-pointer">
            <span className="material-icons text-3xl">add</span>
          </button>
        </Link>
      </main>
    </div>
  );
}
