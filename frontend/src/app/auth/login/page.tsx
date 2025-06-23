'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function login(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.access_token;
        localStorage.setItem('token', token);
        router.push("/user/home");
      } else {
        setErrorMsg(data.message || "Email ou senha incorreto.");
      }
    } catch (error) {
      console.log("error");
      setErrorMsg("Erro na conexão. Tente novamente.");
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden">
      <form 
        onSubmit={login} 
        className="flex flex-col justify-center items-center rounded-xl py-20 px-10 gap-5 bg-white"
      >
        <h1 
          style={{ fontFamily: 'Fredoka'}}
          className="text-5xl font-bold text-sky-600 mb-6 select-none">Estokar</h1>

        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="outline-none border border-zinc-400 rounded-md py-2 px-4 w-72"
          autoComplete="email"
          required
        />

        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="outline-none border border-zinc-400 rounded-md py-2 px-4 w-72"
          autoComplete="current-password"
          required
        />

        <div className="w-full flex justify-end text-sm">
          <Link href="/auth/forgot-password" className="text-sky-600 hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        {errorMsg && <p className="text-red-500 font-semibold text-sm">{errorMsg}</p>}

        <button
          type="submit"
          className={`cursor-pointer bg-sky-600 py-2 px-5 rounded-xl text-white font-bold hover:bg-sky-700 transition-colors duration-150`}
          
        >
          Entrar
        </button>

        <p className="text-sm">
          Não tem conta?{' '}
          <Link href="/auth/register" className="text-sky-600 font-bold hover:underline">
            Registrar
          </Link>
        </p>
      </form>
    </div>
  );
}
