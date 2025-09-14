"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, DollarSign, ShoppingCart, Users } from "lucide-react"

const stats = [
  {
    title: "Vendas do Mês",
    value: "R$ 12.450",
    description: "+20.1% em relação ao mês anterior",
    icon: DollarSign,
    trend: "up",
  },
  {
    title: "Produtos Vendidos",
    value: "89",
    description: "+15% em relação ao mês anterior",
    icon: Package,
    trend: "up",
  },
  {
    title: "Pedidos Hoje",
    value: "12",
    description: "3 pedidos nas últimas 2 horas",
    icon: ShoppingCart,
    trend: "neutral",
  },
  {
    title: "Clientes Ativos",
    value: "234",
    description: "+5 novos clientes esta semana",
    icon: Users,
    trend: "up",
  },
]

const recentSales = [
  {
    customer: "Ana Silva",
    product: "Conjunto Fitness Rosa",
    amount: "R$ 89,90",
    time: "2 min atrás",
  },
  {
    customer: "Maria Santos",
    product: "Top Esportivo Preto",
    amount: "R$ 45,90",
    time: "15 min atrás",
  },
  {
    customer: "Julia Costa",
    product: "Legging Premium",
    amount: "R$ 120,00",
    time: "1 hora atrás",
  },
  {
    customer: "Carla Oliveira",
    product: "Kit Moda Íntima",
    amount: "R$ 156,80",
    time: "2 horas atrás",
  },
]

const topProducts = [
  {
    name: "Conjunto Fitness Rosa",
    sales: 23,
    revenue: "R$ 2.067,70",
  },
  {
    name: "Legging Premium Preta",
    sales: 18,
    revenue: "R$ 2.160,00",
  },
  {
    name: "Top Esportivo Branco",
    sales: 15,
    revenue: "R$ 688,50",
  },
  {
    name: "Kit Moda Íntima Deluxe",
    sales: 12,
    revenue: "R$ 1.881,60",
  },
]

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Sales */}
        <Card className="col-span-4 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Vendas Recentes</CardTitle>
            <CardDescription>Últimas transações realizadas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-card-foreground">{sale.customer}</p>
                    <p className="text-xs text-muted-foreground">{sale.product}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">{sale.amount}</p>
                    <p className="text-xs text-muted-foreground">{sale.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="col-span-3 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Produtos Mais Vendidos</CardTitle>
            <CardDescription>Ranking dos produtos este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full">
                      <span className="text-sm font-bold text-primary-foreground">{index + 1}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-card-foreground">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
