'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function RegisterPage(){
    const router = useRouter();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')


    async function register(e: React.FormEvent) {

        e.preventDefault()
        
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name, email, password })
            }
        )

        if (password !== confirmPassword) {
            setErrorMsg('As senhas não coincidem.')
            return
        }

        if (response.ok) {
            router.push("/auth/login")
        } else {
            const errorData = await response.json()
            setErrorMsg(errorData.message || "Erro ao registrar. Tente novamente.")
        }
    }

    

    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden">
            <form onSubmit={register} className="flex flex-col justify-center items-center rounded-xl py-35 px-70 gap-4">
                <h1 
                    style={{ fontFamily: 'Fredoka'}}
                    className="text-5xl font-bold text-sky-600 mb-6 select-none">Estokar</h1>
                <input 
                    type="text" 
                    name="name" 
                    value={name} 
                    onChange={ (e) => 
                    setName(e.target.value) } 
                    placeholder="Nome completo"
                    className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[270px]"/>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={ (e) => setEmail(e.target.value) } 
                    placeholder="Email"
                    className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[270px]"/>
                <input 
                    type="password" 
                    name="password" 
                    value={password} onChange={ (e) => 
                    setPassword(e.target.value) } 
                    placeholder="Senha"
                    className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[270px]"/>
                <input
                    type="password"
                    placeholder="Confirmar nova senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="outline-none border border-zinc-400 rounded-md py-2 px-5 w-[270px]"
                />
                

                    {errorMsg && <p className="text-red-500 font-semibold">{errorMsg}</p>}
                <div className="flex items-center gap-16 mt-3">
                    <button type="submit" className="cursor-pointer bg-sky-600 py-2 px-5 rounded-xl text-amber-50 font-bold hover:bg-sky-700 transition-colors duration-150">Registrar</button>
                    <Link href="/auth/login">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}