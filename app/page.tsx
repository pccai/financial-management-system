"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/login")
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="flex items-center gap-3 text-slate-600">
        <i className="fa-solid fa-spinner fa-spin text-2xl text-blue-500" />
        <span className="text-lg">加载中...</span>
      </div>
    </div>
  )
}
