"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");

  async function newProduct(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const response = await fetch("http://localhost:3001/products", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, stock: Number(stock) }),
    });

    if (response.ok) {
      router.push("/user/stock");
    }
  }

  return (
    <main className="flex justify-center items-center p-6 overflow-auto min-h-full">
      <form
        onSubmit={newProduct}
        className="flex flex-col justify-center items-center bg-white shadow-lg rounded-xl p-10 gap-4 w-full max-w-md"
      >
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
          required
        />
        <input
          type="number"
          name="stock"
          value={stock}
          min={0}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Estoque"
          className="outline-none border rounded-md border-zinc-400 py-2 px-3 w-32"
          required
        />
        <div className="flex items-center justify-between w-full gap-4">
          <button
            type="submit"
            className="cursor-pointer bg-sky-600 py-2 px-5 rounded-xl text-white font-bold hover:bg-sky-700"
          >
            Criar Produto
          </button>
          <Link href="/user/home" className="text-sky-600 hover:underline">
            Cancelar
          </Link>
        </div>
      </form>
    </main>
  );
}
