"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, TrendingUp, TrendingDown, DollarSign, Download } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Transaction {
  id: string
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  paymentMethod: string
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "income",
    category: "Vendas",
    description: "Venda - Conjunto Fitness Rosa",
    amount: 89.9,
    date: "2024-01-15",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: "2",
    type: "expense",
    category: "Estoque",
    description: "Compra de produtos - Fornecedor ABC",
    amount: 450.0,
    date: "2024-01-14",
    paymentMethod: "PIX",
  },
  {
    id: "3",
    type: "income",
    category: "Vendas",
    description: "Venda - Kit Moda Íntima",
    amount: 156.8,
    date: "2024-01-14",
    paymentMethod: "Cartão de Débito",
  },
  {
    id: "4",
    type: "expense",
    category: "Marketing",
    description: "Anúncios Facebook/Instagram",
    amount: 120.0,
    date: "2024-01-13",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: "5",
    type: "income",
    category: "Vendas",
    description: "Venda - Legging Premium",
    amount: 120.0,
    date: "2024-01-13",
    paymentMethod: "PIX",
  },
]

const monthlyData = [
  { month: "Jan", receitas: 4200, despesas: 2800 },
  { month: "Fev", receitas: 3800, despesas: 2400 },
  { month: "Mar", receitas: 5200, despesas: 3200 },
  { month: "Abr", receitas: 4800, despesas: 2900 },
  { month: "Mai", receitas: 6200, despesas: 3800 },
  { month: "Jun", receitas: 5800, despesas: 3400 },
]

const categoryData = [
  { category: "Vendas", amount: 12450 },
  { category: "Estoque", amount: -3200 },
  { category: "Marketing", amount: -890 },
  { category: "Operacional", amount: -650 },
]

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const incomeCategories = ["Vendas", "Outros"]
  const expenseCategories = ["Estoque", "Marketing", "Operacional", "Impostos", "Outros"]
  const paymentMethods = ["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro", "Transferência"]

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpenses

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory
    return matchesCategory
  })

  const handleAddTransaction = () => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString(),
    }
    setTransactions([transaction, ...transactions])
    setNewTransaction({
      type: "income",
      category: "",
      description: "",
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      paymentMethod: "",
    })
    setIsAddDialogOpen(false)
  }

  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, "id">>({
    type: "income",
    category: "",
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
          <p className="text-muted-foreground">Controle suas receitas e despesas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Transação</DialogTitle>
                <DialogDescription>Registre uma receita ou despesa</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Tipo</Label>
                  <Select
                    value={newTransaction.type}
                    onValueChange={(value: "income" | "expense") =>
                      setNewTransaction({ ...newTransaction, type: value, category: "" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Receita</SelectItem>
                      <SelectItem value="expense">Despesa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Categoria</Label>
                  <Select
                    value={newTransaction.category}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {(newTransaction.type === "income" ? incomeCategories : expenseCategories).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={newTransaction.description}
                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                    placeholder="Descreva a transação"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newTransaction.amount}
                      onChange={(e) =>
                        setNewTransaction({ ...newTransaction, amount: Number.parseFloat(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div>
                    <Label>Data</Label>
                    <Input
                      type="date"
                      value={newTransaction.date}
                      onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={newTransaction.paymentMethod}
                    onValueChange={(value) => setNewTransaction({ ...newTransaction, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleAddTransaction}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Adicionar Transação
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Receitas</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalIncome.toFixed(2).replace(".", ",")}</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Despesas</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ {totalExpenses.toFixed(2).replace(".", ",")}</div>
            <p className="text-xs text-muted-foreground">-5% em relação ao mês anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              R$ {netProfit.toFixed(2).replace(".", ",")}
            </div>
            <p className="text-xs text-muted-foreground">{netProfit >= 0 ? "Lucro" : "Prejuízo"} no período</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Receitas vs Despesas</CardTitle>
                <CardDescription>Comparativo mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="receitas" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Por Categoria</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="amount" fill="#d4af37" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todas as categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {[...incomeCategories, ...expenseCategories].map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Transações Recentes</CardTitle>
              <CardDescription>Histórico de receitas e despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`p-2 rounded-full ${
                          transaction.type === "income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">{transaction.description}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline">{transaction.category}</Badge>
                          <span>•</span>
                          <span>{transaction.paymentMethod}</span>
                          <span>•</span>
                          <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {transaction.type === "income" ? "+" : "-"}R$ {transaction.amount.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Resumo Mensal</CardTitle>
                <CardDescription>Principais métricas do mês</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Transações:</span>
                  <span className="font-medium text-card-foreground">{transactions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ticket Médio:</span>
                  <span className="font-medium text-card-foreground">
                    R${" "}
                    {(totalIncome / transactions.filter((t) => t.type === "income").length || 0)
                      .toFixed(2)
                      .replace(".", ",")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem de Lucro:</span>
                  <span className="font-medium text-card-foreground">
                    {((netProfit / totalIncome) * 100 || 0).toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Formas de Pagamento</CardTitle>
                <CardDescription>Distribuição por método</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentMethods.slice(0, 4).map((method) => {
                  const count = transactions.filter((t) => t.paymentMethod === method).length
                  const percentage = (count / transactions.length) * 100 || 0
                  return (
                    <div key={method} className="flex justify-between">
                      <span className="text-muted-foreground">{method}:</span>
                      <span className="font-medium text-card-foreground">{percentage.toFixed(1)}%</span>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
