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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Eye,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Calendar,
  User,
  Phone,
  MapPin,
} from "lucide-react"

interface Sale {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: SaleItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "refunded"
  date: string
  deliveryDate?: string
}

interface SaleItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

const mockSales: Sale[] = [
  {
    id: "VD001",
    customerName: "Ana Silva",
    customerPhone: "(11) 99999-9999",
    customerAddress: "Rua das Flores, 123 - São Paulo, SP",
    items: [
      { productId: "1", productName: "Conjunto Fitness Rosa", quantity: 1, price: 89.9 },
      { productId: "2", productName: "Top Esportivo Preto", quantity: 1, price: 45.9 },
    ],
    total: 135.8,
    status: "delivered",
    paymentMethod: "PIX",
    paymentStatus: "paid",
    date: "2024-01-15",
    deliveryDate: "2024-01-18",
  },
  {
    id: "VD002",
    customerName: "Maria Santos",
    customerPhone: "(11) 88888-8888",
    customerAddress: "Av. Paulista, 456 - São Paulo, SP",
    items: [{ productId: "3", productName: "Legging Premium", quantity: 2, price: 120.0 }],
    total: 240.0,
    status: "shipped",
    paymentMethod: "Cartão de Crédito",
    paymentStatus: "paid",
    date: "2024-01-14",
    deliveryDate: "2024-01-17",
  },
  {
    id: "VD003",
    customerName: "Julia Costa",
    customerPhone: "(11) 77777-7777",
    customerAddress: "Rua Augusta, 789 - São Paulo, SP",
    items: [{ productId: "4", productName: "Kit Moda Íntima Deluxe", quantity: 1, price: 156.8 }],
    total: 156.8,
    status: "confirmed",
    paymentMethod: "Cartão de Débito",
    paymentStatus: "paid",
    date: "2024-01-13",
  },
  {
    id: "VD004",
    customerName: "Carla Oliveira",
    customerPhone: "(11) 66666-6666",
    customerAddress: "Rua Oscar Freire, 321 - São Paulo, SP",
    items: [
      { productId: "1", productName: "Conjunto Fitness Rosa", quantity: 1, price: 89.9 },
      { productId: "5", productName: "Sutiã Push-up Nude", quantity: 2, price: 78.5 },
    ],
    total: 246.9,
    status: "pending",
    paymentMethod: "PIX",
    paymentStatus: "pending",
    date: "2024-01-12",
  },
]

const statusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  shipped: { label: "Enviado", color: "bg-purple-100 text-purple-800", icon: Truck },
  delivered: { label: "Entregue", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
}

const paymentStatusConfig = {
  pending: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  paid: { label: "Pago", color: "bg-green-100 text-green-800" },
  refunded: { label: "Reembolsado", color: "bg-red-100 text-red-800" },
}

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(mockSales)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null)
  const [isNewSaleDialogOpen, setIsNewSaleDialogOpen] = useState(false)
  const [newSale, setNewSale] = useState<Sale>({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    items: [],
    total: 0,
    status: "pending",
    paymentMethod: "",
    paymentStatus: "pending",
    date: new Date().toISOString().split("T")[0],
  })

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || sale.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const updateSaleStatus = (saleId: string, newStatus: Sale["status"]) => {
    setSales(
      sales.map((sale) =>
        sale.id === saleId
          ? {
              ...sale,
              status: newStatus,
              deliveryDate: newStatus === "delivered" ? new Date().toISOString().split("T")[0] : sale.deliveryDate,
            }
          : sale,
      ),
    )
  }

  const updatePaymentStatus = (saleId: string, newPaymentStatus: Sale["paymentStatus"]) => {
    setSales(sales.map((sale) => (sale.id === saleId ? { ...sale, paymentStatus: newPaymentStatus } : sale)))
  }

  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0)
  const pendingSales = sales.filter((sale) => sale.status === "pending").length
  const deliveredSales = sales.filter((sale) => sale.status === "delivered").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vendas</h1>
          <p className="text-muted-foreground">Gerencie seus pedidos e vendas</p>
        </div>
        <Dialog open={isNewSaleDialogOpen} onOpenChange={setIsNewSaleDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Nova Venda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Venda</DialogTitle>
              <DialogDescription>Registre uma nova venda</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Cliente</Label>
                  <Input
                    value={newSale.customerName}
                    onChange={(e) => setNewSale({ ...newSale, customerName: e.target.value })}
                    placeholder="Nome completo"
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={newSale.customerPhone}
                    onChange={(e) => setNewSale({ ...newSale, customerPhone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div>
                <Label>Endereço</Label>
                <Input
                  value={newSale.customerAddress}
                  onChange={(e) => setNewSale({ ...newSale, customerAddress: e.target.value })}
                  placeholder="Endereço completo"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Forma de Pagamento</Label>
                  <Select
                    value={newSale.paymentMethod}
                    onValueChange={(value) => setNewSale({ ...newSale, paymentMethod: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                      <SelectItem value="Cartão de Débito">Cartão de Débito</SelectItem>
                      <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Total (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newSale.total}
                    onChange={(e) => setNewSale({ ...newSale, total: Number.parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <Button
                onClick={() => {
                  const sale: Sale = {
                    ...newSale,
                    id: `VD${String(sales.length + 1).padStart(3, "0")}`,
                    items: [], // Simplificado para o exemplo
                  }
                  setSales([sale, ...sales])
                  setNewSale({
                    customerName: "",
                    customerPhone: "",
                    customerAddress: "",
                    items: [],
                    total: 0,
                    status: "pending",
                    paymentMethod: "",
                    paymentStatus: "pending",
                    date: new Date().toISOString().split("T")[0],
                  })
                  setIsNewSaleDialogOpen(false)
                }}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Criar Venda
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sales Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total de Vendas</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">R$ {totalSales.toFixed(2).replace(".", ",")}</div>
            <p className="text-xs text-muted-foreground">{sales.length} pedidos no total</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Pedidos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingSales}</div>
            <p className="text-xs text-muted-foreground">Aguardando processamento</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Entregas Realizadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{deliveredSales}</div>
            <p className="text-xs text-muted-foreground">Pedidos finalizados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Ticket Médio</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              R$ {(totalSales / sales.length || 0).toFixed(2).replace(".", ",")}
            </div>
            <p className="text-xs text-muted-foreground">Valor médio por pedido</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Pedidos</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por cliente ou ID do pedido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="shipped">Enviado</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sales List */}
          <div className="space-y-4">
            {filteredSales.map((sale) => {
              const StatusIcon = statusConfig[sale.status].icon
              return (
                <Card key={sale.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-card-foreground">#{sale.id}</h3>
                            <Badge className={statusConfig[sale.status].color}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {statusConfig[sale.status].label}
                            </Badge>
                            <Badge className={paymentStatusConfig[sale.paymentStatus].color}>
                              {paymentStatusConfig[sale.paymentStatus].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {sale.customerName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {sale.customerPhone}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(sale.date).toLocaleDateString("pt-BR")}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-card-foreground">
                            R$ {sale.total.toFixed(2).replace(".", ",")}
                          </p>
                          <p className="text-sm text-muted-foreground">{sale.paymentMethod}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setSelectedSale(sale)}>
                            <Eye className="mr-1 h-3 w-3" />
                            Ver Detalhes
                          </Button>
                          {sale.status === "pending" && (
                            <Button
                              size="sm"
                              onClick={() => updateSaleStatus(sale.id, "confirmed")}
                              className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                              Confirmar
                            </Button>
                          )}
                          {sale.status === "confirmed" && (
                            <Button
                              size="sm"
                              onClick={() => updateSaleStatus(sale.id, "shipped")}
                              className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                              Enviar
                            </Button>
                          )}
                          {sale.status === "shipped" && (
                            <Button
                              size="sm"
                              onClick={() => updateSaleStatus(sale.id, "delivered")}
                              className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                              Entregar
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Vendas por Status</CardTitle>
                <CardDescription>Distribuição dos pedidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                  const count = sales.filter((sale) => sale.status === status).length
                  const percentage = (count / sales.length) * 100 || 0
                  return (
                    <div key={status} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        <span className="text-card-foreground">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} pedidos</span>
                        <span className="font-medium text-card-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Formas de Pagamento</CardTitle>
                <CardDescription>Preferências dos clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {["PIX", "Cartão de Crédito", "Cartão de Débito", "Dinheiro"].map((method) => {
                  const count = sales.filter((sale) => sale.paymentMethod === method).length
                  const percentage = (count / sales.length) * 100 || 0
                  return (
                    <div key={method} className="flex justify-between">
                      <span className="text-card-foreground">{method}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} pedidos</span>
                        <span className="font-medium text-card-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Sale Details Dialog */}
      <Dialog open={!!selectedSale} onOpenChange={() => setSelectedSale(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido #{selectedSale?.id}</DialogTitle>
            <DialogDescription>Informações completas do pedido</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Informações do Cliente</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSale.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSale.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSale.customerAddress}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Status do Pedido</h4>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Badge className={statusConfig[selectedSale.status].color}>
                        {statusConfig[selectedSale.status].label}
                      </Badge>
                      <Badge className={paymentStatusConfig[selectedSale.paymentStatus].color}>
                        {paymentStatusConfig[selectedSale.paymentStatus].label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Pedido realizado em {new Date(selectedSale.date).toLocaleDateString("pt-BR")}
                    </p>
                    {selectedSale.deliveryDate && (
                      <p className="text-sm text-muted-foreground">
                        Entregue em {new Date(selectedSale.deliveryDate).toLocaleDateString("pt-BR")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-card-foreground mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  {selectedSale.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                      </div>
                      <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
                  <p className="font-medium">{selectedSale.paymentMethod}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    R$ {selectedSale.total.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                {selectedSale.paymentStatus === "pending" && (
                  <Button
                    onClick={() => updatePaymentStatus(selectedSale.id, "paid")}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Confirmar Pagamento
                  </Button>
                )}
                {selectedSale.status === "pending" && (
                  <Button
                    onClick={() => {
                      updateSaleStatus(selectedSale.id, "confirmed")
                      setSelectedSale({ ...selectedSale, status: "confirmed" })
                    }}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Confirmar Pedido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
