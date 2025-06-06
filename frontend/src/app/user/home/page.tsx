'use client'

import { useRouter } from "next/navigation"

export default function HomePage(){
    const router = useRouter()

    async function logout() {
        localStorage.removeItem('token')
        router.push('/auth/login')
    }
    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden">
            <div>
                <h1>Bem vindo</h1>
                <button onClick={logout}>Sair</button>
            </div>
        </div>
    )
}