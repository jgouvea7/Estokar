'use client'

import SideBar from "@/components/sidebar"
import Link from "next/link"

export default function HomePage(){

    
    return(
        <div className="flex justify-center items-center min-h-screen overflow-hidden">
            <SideBar/>
            <main>
                <h1>Bem vindo</h1>
            </main>
            <Link href="/user/new-product">
                <button className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all cursor-pointer">
                    <span className="material-icons text-3xl">add</span>
                </button>
            </Link>
        </div>
    )
}