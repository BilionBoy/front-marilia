"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [cpf, setCpf] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const formatCPF = (value: string) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "")

    // Aplica a máscara do CPF
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
    }
    return numbers.slice(0, 11).replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular chamada para API
    setTimeout(() => {
      // Aqui você fará a chamada para seu backend Ruby
      console.log("Login attempt:", { cpf: cpf.replace(/\D/g, ""), password })

      // Simular login bem-sucedido - definir cookie
      document.cookie = "auth-token=authenticated; path=/; max-age=86400" // 24 horas

      setIsLoading(false)
      // Usar router do Next.js em vez de window.location
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <Card className="w-full shadow-xl border-0 bg-card">
      <CardHeader className="text-center pb-8">
        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 relative">
            <Image src="/logo-marilia-cruz.png" alt="MC Marilia Cruz Logo" fill className="object-contain" priority />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">MC Marilia Cruz</CardTitle>
        <CardDescription className="text-muted-foreground text-base">Sistema Administrativo</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cpf" className="text-sm font-medium text-foreground">
              CPF
            </Label>
            <Input
              id="cpf"
              type="text"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={14}
              className="h-12 text-base bg-input border-border focus:ring-ring"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base bg-input border-border focus:ring-ring pr-12"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isLoading}
          >
            {isLoading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
