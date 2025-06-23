'use client'

import SideBar from "@/components/sidebar";
import { useEffect, useState } from "react";


export default function ProfilePage() {
  const [email, setEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const emailFromToken = payload.email;
        setEmail(emailFromToken);

        fetch(`http://localhost:3001/users/${emailFromToken}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            setProfile(data);
          })
          .catch((err) => console.error("Erro ao buscar perfil:", err));
      } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
      }
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
        <main className="md:ml-56 flex flex-1 justify-center items-start bg-gray-50 px-4 py-6 overflow-auto w-full">
            <div className="w-full max-w-md md:max-w-xl bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
                {!profile ? (
                    
                <p className="text-gray-500">...</p>
                ) : (
                <div className="space-y-5">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6">{profile.name}</h1>

                    <div className="flex items-center gap-3">
                    <span className="text-gray-600 font-semibold">Email:</span>
                    <span className="text-gray-800 text-lg">{profile.email}</span>
                    </div>
                </div>
                )}
            </div>
        </main>
  </div>
  );
}
