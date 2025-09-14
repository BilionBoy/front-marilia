import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Image src="/logo-marilia-cruz.png" alt="MC Marilia Cruz" width={200} height={200} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sistema Administrativo MC Marilia Cruz</h1>
          <p className="text-gray-600">Navegue pelas páginas do sistema</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/login"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Tela de Login</h3>
            <p className="text-sm opacity-90">Página de autenticação</p>
          </Link>

          <Link
            href="/dashboard"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Dashboard</h3>
            <p className="text-sm opacity-90">Visão geral do sistema</p>
          </Link>

          <Link
            href="/dashboard/produtos"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Produtos</h3>
            <p className="text-sm opacity-90">Gestão de produtos</p>
          </Link>

          <Link
            href="/dashboard/financeiro"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Financeiro</h3>
            <p className="text-sm opacity-90">Controle financeiro</p>
          </Link>

          <Link
            href="/dashboard/vendas"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Vendas</h3>
            <p className="text-sm opacity-90">Gestão de vendas</p>
          </Link>

          <Link
            href="/dashboard/promocoes"
            className="bg-accent text-white p-4 rounded-lg text-center hover:bg-accent/90 transition-colors"
          >
            <h3 className="font-semibold mb-2">Promoções</h3>
            <p className="text-sm opacity-90">Cupons e descontos</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
