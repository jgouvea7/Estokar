'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const id = searchParams.get('userId')
    if (!id) {
      setErrorMsg('Link inválido ou expirado.')
    } else {
      setUserId(id)
    }
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('As senhas não coincidem.')
      return
    }

    if (!userId) {
      setErrorMsg('Usuário não identificado.')
      return
    }

    const response = await fetch('http://localhost:3001/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, password }),
    })

    if (response.ok) {
      setTimeout(() => router.push('/auth/login'), 1500)
    } else {
      const data = await response.json()
      setErrorMsg(data.message || 'Erro ao redefinir senha.')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center rounded-xl py-20 px-10 gap-4 border border-gray-300 shadow-lg"
      >
        <h2 className="text-1xl text-sky-600 font-bold mb-4">Redefinir Senha</h2>

        <input
          type="password"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[300px]"
        />

        <input
          type="password"
          placeholder="Confirmar nova senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[300px]"
        />

        {errorMsg && <p className="text-red-500 font-semibold">{errorMsg}</p>}

        <button
          type="submit"
          className="cursor-pointer bg-sky-600 py-2 px-5 rounded-xl text-white font-bold hover:bg-sky-700"
        >
          Alterar senha
        </button>
      </form>
    </div>
  )
}
