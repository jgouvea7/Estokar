'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function VerifyToken() {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const res = await fetch('http://localhost:3001/auth/verify-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.message || 'Token inválido')
      return
    }

    router.push(`/auth/reset-password?userId=${data.userId}`)
  }

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 w-[350px] p-10 bg-white rounded-xl shadow">
        <h2 className="text-1xl text-sky-600 font-bold mb-4">Digite o código recebido</h2>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Código de 6 dígitos"
          className="border border-gray-300 px-4 py-2 rounded w-full mb-2 outline-none"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
        >
          Verificar
        </button>
        
    </form>
    </div>
  )
}
