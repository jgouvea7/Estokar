'use client'

import SideBar from "@/components/sidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
}

enum OperationType {
  SELL = 'SELL',
  BROKEN = 'BROKEN',
}

export default function OperationPage(){
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [operationTypes, setOperationTypes] = useState<Record<string, OperationType>>( {});
    const [quantities, setQuantities] = useState<Record<string, number>>({});

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

            setUserId(getUserIdFromToken(token));

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

    async function handleSendOperation(productId: string) {
        const token = localStorage.getItem('token');
        if (!token || !userId) {
            alert("Usuário não autenticado");
            return;
        }

        const quantity = quantities[productId];
        const typeOperation = operationTypes[productId];

        if (!quantity || quantity <= 0) {
            alert("Informe uma quantidade válida");
            return;
        }

        if (!typeOperation) {
            alert("Informe o tipo da operação");
            return;
        }

        const body = {
            userId,
            productId,
            quantity,
            typeOperation,
        };

        try {
            const response = await fetch('http://localhost:3001/operations/send-operation', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

        if (response.ok) {
            router.push('/user/home')
        }

        } catch (error) {
            console.error(error);
            alert("Erro ao enviar operação");
        }
    }

  return (
    <div>
      <SideBar/>
      <main className="ml-13 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Estoque</h1>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.description}</p>
              <p className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                Estoque: {product.stock}
              </p>

              <div className="mt-5 flex flex-col gap-2">
                <select
                  value={operationTypes[product.id] || ''}
                  onChange={e => setOperationTypes({...operationTypes, [product.id]: e.target.value as OperationType})}
                  className="border rounded px-2 py-1"
                >
                  <option value="" disabled>Tipo de operação</option>
                  <option value={OperationType.SELL}>Venda</option>
                  <option value={OperationType.BROKEN}>Quebrado</option>
                </select>

                <input
                  type="number"
                  min={1}
                  placeholder="Quantidade"
                  value={quantities[product.id] || ''}
                  onChange={e => setQuantities({...quantities, [product.id]: Number(e.target.value)})}
                  className="border rounded px-2 py-1"
                />

                <button
                  onClick={() => handleSendOperation(product.id)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 rounded"
                >
                  Enviar Operação
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
