"use client";

import ButtonAdd from "@/components/add-product";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Log {
  _id: string;
  typeLog: string;
  createdAt: string;
  stockBefore?: number;
  stockAfter?: number;
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
      } catch (error) {
        console.error("Erro ao decodificar o token JWT", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function fetchLogs() {
      try {
        const response = await fetch(`http://localhost:3001/logs/user/${userId}`);
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Erro ao buscar logs:", error);
      }
    }

    fetchLogs();
  }, [userId]);

  return (
    <div>
      <h1 className="text-2xl text-sky-600 font-bold mb-6">Logs do Usuário</h1>
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

      <Link href="/user/new-product">
        <ButtonAdd/>
      </Link>
    </div>
  );
}
