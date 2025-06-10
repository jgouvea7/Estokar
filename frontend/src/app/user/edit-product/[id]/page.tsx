'use client'

import SideBar from "@/components/sidebar";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PageProps {
  params: {
    id: string
  }
}

export default function EditPage({ params }: PageProps) {
  const router = useRouter();
  const productId = params.id;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`http://localhost:3001/products/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Produto não encontrado");

        const data = await res.json();
        setName(data.name);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar o produto");
      }
    }

    fetchProduct();
  }, [productId]);

  async function editProduct(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert("Usuário não autenticado");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          description,
        })
      });

      if (!response.ok) throw new Error("Erro ao editar produto");

      alert("Produto editado com sucesso!");
      router.push("/user/stock");
    } catch (error) {
      console.error(error);
      alert("Falha ao editar produto.");
    }
  }


  return (
    <div className="flex h-screen w-full">
      <SideBar />
      <main className="flex flex-1 justify-center items-center bg-gray-50">
        <form onSubmit={editProduct} className="flex flex-col justify-center items-center bg-white shadow-lg rounded-xl p-10 gap-4 w-full max-w-md ml-15">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
            className="outline-none border rounded-md border-zinc-400 py-2 px-3 w-full"
            required
          />
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
            className="outline-none border rounded-md border-zinc-400 py-2 px-3 w-full h-28 resize-none"
          />
          <div className="flex items-center justify-between w-full gap-4">
            <button
              type="submit"
              className="cursor-pointer bg-blue-500 py-2 px-5 rounded-xl text-white font-bold hover:bg-blue-600 disabled:opacity-50"
            >
                Editar
            </button>
            <Link href="/user/stock" className="text-blue-600 hover:underline">
              Cancelar
            </Link>
          </div>
        </form>
      </main>
      <Link href="/user/new-product">
        <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all cursor-pointer">
          <span className="material-icons text-3xl">add</span>
        </button>
      </Link>
    </div>
  );
}
