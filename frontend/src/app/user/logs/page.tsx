"use client";

import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";

interface Log {
  _id: string;
  typeLog: string;
  createdAt: string;
  stockBefore?: number;
  stockAfter?: number;
  productId?: string;
  name?: string;
  description?: string;
  extraInfo?: any;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.sub);
      } catch (err) {
        console.error("Erro ao decodificar o token JWT", err);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchLogs() {
      try {
        const res = await fetch(`http://localhost:3001/logs/user/${userId}`);
        const data = await res.json();
        setLogs(data);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      }
    }

    fetchLogs();
  }, [userId]);

  return (
    <div className="flex h-screen w-full">
      <SideBar />
      <main className="ml-16 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Logs do Usuário</h1>
        {logs.length === 0 ? (
          <p>Nenhum log encontrado.</p>
        ) : (
          <ul className="space-y-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {logs.map((log) => (
              <li
                key={log._id}
                className="border border-gray-300 rounded-xl bg-white p-4 shadow-sm"
              >
                <p><strong>Tipo:</strong> {log.typeLog}</p>
                <p><strong>Data:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                {log.name && <p><strong>Nome:</strong> {log.name}</p>}
                {log.description && <p><strong>Descrição:</strong> {log.description}</p>}
                {log.stockBefore !== undefined && log.stockAfter !== undefined && (
                  <p><strong>Estoque:</strong> {log.stockBefore} → {log.stockAfter}</p>
                )}
                {log.extraInfo && (
                  <div className="mt-2">
                    <strong>Extra Info:</strong>
                    <pre className="text-sm bg-gray-100 p-2 rounded mt-1">
                      {JSON.stringify(log.extraInfo, null, 2)}
                    </pre>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
