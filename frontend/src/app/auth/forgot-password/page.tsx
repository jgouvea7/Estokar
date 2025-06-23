'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');

    const res = await fetch('http://localhost:3001/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      router.push('/auth/verify-code');
    } else {
      const data = await res.json();
      setErrorMsg(data.message || 'Erro ao enviar o código.');
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      
      <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center rounded-xl py-20 px-10 gap-6 bg-white">
        <h1 
          style={{ fontFamily: 'Fredoka'}}
          className="text-5xl font-bold text-sky-600 mb-6 select-none">Estokar</h1>

        <h2 className="text-center text-sky-600 text-1xl font-bold">Esqueci a senha</h2>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="border outline-none border-gray-300 w-70 rounded-md p-2"
        />
        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
        <div className='flex items-center justify-around gap-15'>
          <button type="submit" className="bg-sky-600 text-white py-2 px-2 rounded-md font-semibold hover:bg-sky-700 transition-colors duration-150 cursor-pointer">
            Enviar código
          </button>
          <Link className='text-sky-700 hover:underline' href="/auth/login">
            Voltar
          </Link>
        </div>
      </form>
    </div>
  );
}
