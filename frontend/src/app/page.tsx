'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token');

    if(token) {
      router.push('/user/home')
    } else {
      router.push('/auth/login')
    }
  })


  return null;
}
