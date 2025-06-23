"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function parseJwt(token: string): null | { [key: string]: any } {
  try {
    const base64Payload = token.split(".")[1];
    const payload = atob(base64Payload);
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

function getNext6MonthsWithEmptyStock(startDate: Date) {
  const months = [];
  const now = new Date();
  const date = new Date(startDate.getFullYear(), startDate.getMonth(), 1);

  for (let i = 0; i < 6; i++) {
    const isFuture =
      date.getFullYear() > now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() > now.getMonth());

    months.push({
      name: date.toLocaleDateString("default", {
        month: "2-digit",
        year: "2-digit",
      }).replace("/", "/"),
      stock: isFuture ? null : 0,
    });

    date.setMonth(date.getMonth() + 1);
  }

  return months;
}

export default function DashboardPage() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalStock, setTotalStock] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [stockData, setStockData] = useState<
    { name: string; stock: number | null }[]
  >([]);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const payload = parseJwt(token);
      if (!payload?.email) {
        console.error("Token inválido, email não encontrado");
        return;
      }

      const userEmail = payload.email;

      const userRes = await fetch(`http://localhost:3001/users/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!userRes.ok) {
        console.error("Erro ao buscar usuário", userRes.status);
        return;
      }

      const user = await userRes.json();
      const createdAt = new Date(user.createdAt);

      const productsRes = await fetch("http://localhost:3001/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!productsRes.ok) {
        console.error("Erro ao buscar produtos", productsRes.status);
        return;
      }

      const products = await productsRes.json();

      const totalStockCalc = products.reduce(
        (acc: number, product: any) => acc + product.stock,
        0
      );

      setTotalProducts(products.length);
      setTotalStock(totalStockCalc);
      setOutOfStock(products.filter((p: any) => p.stock === 0).length);

      const months = getNext6MonthsWithEmptyStock(createdAt);
      const data = months.map((month) => ({
        ...month,
        stock: month.stock === 0 ? totalStockCalc : null,
      }));

      setStockData(data);
    }

    fetchData();
  }, []);

  return (
    <main>
      <div className="bg-white rounded-xl shadow-md mb-8 w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-4xl xl:max-w-5xl mx-auto h-[300px] sm:h-[350px] md:h-[380px] lg:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={stockData}
            margin={{ left: -25, right: 10, top: 10, bottom: 0 }}
          >
            <Line
              type="monotone"
              dataKey="stock"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
              isAnimationActive={false}
              connectNulls={false}
            />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-4 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-3xl xl:max-w-5xl mx-auto mt-6">
        <Link href="/user/stock">
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-5 sm:p-6 lg:p-8 cursor-pointer">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
              Total de Produtos
            </h2>
            <p className="text-lg sm:text-xl font-bold text-blue-500">
              {totalProducts}
            </p>
          </div>
        </Link>

        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-5 sm:p-6 lg:p-8">
          <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
            Estoque Total
          </h2>
          <p className="text-lg sm:text-xl font-bold text-green-500">{totalStock}</p>
        </div>

        <Link href="/user/out-stock">
          <div className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all p-5 sm:p-6 lg:p-8 col-span-1 sm:col-span-2">
            <h2 className="text-sm sm:text-base font-semibold text-gray-700 mb-1">
              Esgotados
            </h2>
            <p className="text-lg sm:text-xl font-bold text-red-500">{outOfStock}</p>
          </div>
        </Link>
      </div>

      <Link href="/user/new-product">
        <button className="fixed bottom-6 right-6 bg-sky-600 hover:bg-sky-700 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all duration-150 cursor-pointer">
          <span className="material-icons text-3xl">add</span>
        </button>
      </Link>
    </main>
  );
}
