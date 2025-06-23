'use client';

import ButtonAdd from "@/components/add-product";
import SideBar from "@/components/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
}


export default function UpdateStockPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<Record<string, number>>({});

  function getUserIdFromToken(token: string) {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      const jsonPayload = JSON.parse(payload);
      return jsonPayload.sub || jsonPayload.userId || null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem('token');
      if (!token) return;

      const extractedUserId = getUserIdFromToken(token);
      setUserId(extractedUserId);

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

        const stockInit: Record<string, number> = {};
        mapped.forEach((product: Product) => {
          stockInit[product.id] = product.stock;
        });
        setStockValues(stockInit);

      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  async function handleUpdateStock(productId: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Usuário não autenticado");
      return;
    }

    const idFromToken = getUserIdFromToken(token);
    if (!idFromToken) {
      alert("Token inválido ou expirado");
      return;
    }

    const newStock = stockValues[productId];

    try {
      const response = await fetch(`http://localhost:3001/products/update-stock/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: idFromToken,
          stock: newStock
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro:", response.status, errorText);
        alert("Erro ao atualizar estoque");
        return;
      }

      setProducts(prev =>
        prev.map(p =>
          p.id === productId ? { ...p, stock: newStock } : p
        )
      );

      alert("Estoque atualizado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar atualização de estoque");
    }
  }

  return (
    <div>
      <h1 className="text-2xl text-sky-600 font-bold mb-6">Atualizar Estoque</h1>
      {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
        ) : (
        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between h-full">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>

                <p className="font-bold">
                  Estoque atual: <span className="font-normal">{product.stock}</span>
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={stockValues[product.id] ?? ''}
                    onChange={e =>
                      setStockValues({
                        ...stockValues,
                        [product.id]: Number(e.target.value),
                      })
                    }
                    className="border rounded px-2 py-1 w-20"
                  />
                  <button
                    onClick={() => handleUpdateStock(product.id)}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-1.5 px-3 rounded cursor-pointer transition-colors duration-200"
                  >
                    Atualizar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}
      <Link href="/user/new-product">
          <ButtonAdd/>
      </Link>
    </div>
  );
}
