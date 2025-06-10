'use client'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react"


export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');


    async function login(e: React.FormEvent){
        e.preventDefault();

        try{
            const response = await fetch('http://localhost:3001/auth/login', {
                method: 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if(response.ok) {
                const token = data.access_token;
                localStorage.setItem('token', token);
                
                router.push("/user/home")
            } else {
                setErrorMsg(data.message || "Email ou senha incorreto.")
            }
        } catch (error) {
            console.log("error")
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden">
            <form onSubmit={login} className="flex flex-col justify-center items-center rounded-xl py-40 px-70 gap-4">
                <input 
                    type="text"
                    name="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-2"/>
                <input 
                    type="password"
                    name="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password"
                    className="outline-none border-1 rounded-md border-zinc-400 py-2 px-2"/>

                    {errorMsg && <p className="flex text-red-500 font-semibold text-sm">{errorMsg}</p>}
                <button type="submit" className="cursor-pointer bg-blue-500 py-2 px-5 rounded-xl text-amber-50 font-bold hover:bg-blue-600">Entrar</button>
                <h1>Não tem conta? <Link href="/auth/register" className="text-blue-500 font-bold">Registrar</Link></h1>
            </form>
        </div>
        
    )
}