"use client";

import { useEffect, useState } from "react";
import SideBar from "@/components/sidebar";
import Link from "next/link";
import ButtonAdd from "@/components/add-product";

interface Product {
  id: string;
  name: string;
  description: string;
  stock: number;
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:3001/products", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Erro ao buscar produtos: ${response.status}`);
        }

        const data = await response.json();
        const mapped = data.map((p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          stock: p.stock,
        }));
        setProducts(mapped);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, []);

  async function handleDelete(id: string) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir produto.");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Não foi possível excluir o produto.");
    }
  }

  return (
    <div>
      <main>
        <h1 className="text-2xl text-sky-600 font-bold mb-6">Estoque</h1>

        {products.length === 0 ? (
        <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col"
              >
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className=" flex-grow">{product.description}</p>
                <div>
                  <strong>Estoque:</strong> <span>{product.stock}</span>
                </div>
                <p
                  className={`font-medium ${
                    product.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.stock > 0 ? "Disponível" : "Esgotado"}
                </p>

                <div className="mt-5 flex gap-3">
                  <Link
                    href={`/user/edit-product/${product.id}`}
                    className="flex-1 text-center py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded transition-colors duration-200"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 py-1 text-red-600 hover:bg-red-200 font-bold cursor-pointer rounded transition-colors duration-200"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Link href="/user/new-product">
          <ButtonAdd/>
        </Link>
      </main>
    </div>
  );
}
