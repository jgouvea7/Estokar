'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"


export default function RegisterPage(){
    const router = useRouter();
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [bornDate, setBornDate] = useState('')
    const [errorMsg, setErrorMsg] = useState('')


    async function register(e: React.FormEvent) {

        e.preventDefault()
        
        const response = await fetch('http://localhost:3001/users', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name, email, password, bornDate })
            }
        )

        if (response.ok) {
            router.push("/auth/login")
        } else {
            const errorData = await response.json()
            setErrorMsg(errorData.message || "Erro ao registrar. Tente novamente.")
        }
    }

    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden">
            <form onSubmit={register} className="flex flex-col justify-center items-center rounded-xl py-40 px-70 gap-4">
                <input 
                    type="text" 
                    name="name" 
                    value={name} 
                    onChange={ (e) => 
                    setName(e.target.value) } 
                    placeholder="Nome"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-5"/>
                <input 
                    type="email" 
                    name="email" 
                    value={email} 
                    onChange={ (e) => setEmail(e.target.value) } 
                    placeholder="Email"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-5"/>
                <input 
                    type="password" 
                    name="password" 
                    value={password} onChange={ (e) => 
                    setPassword(e.target.value) } 
                    placeholder="Senha"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-5"/>
                <input 
                    type="date" 
                    name="bornDate" 
                    value={bornDate} 
                    onChange={ (e) => setBornDate(e.target.value) } 
                    placeholder="Data de Nascimento"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-3 w-full min-w-[182px]"/>

                    {errorMsg && <p className="text-red-500 font-semibold">{errorMsg}</p>}
                <div className="flex items-center gap-7">
                    <button type="submit" className="cursor-pointer bg-blue-500 py-2 px-5 rounded-xl text-amber-50 font-bold hover:bg-blue-600">Registrar</button>
                    <Link href="/auth/login">Cancelar</Link>
                </div>
            </form>
        </div>
    )
}