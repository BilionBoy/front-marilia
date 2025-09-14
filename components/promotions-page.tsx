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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  Percent,
  Calendar,
  Users,
  Copy,
  Eye,
  EyeOff,
  Gift,
  TrendingUp,
} from "lucide-react"

interface Promotion {
  id: string
  name: string
  code: string
  type: "percentage" | "fixed" | "freeShipping"
  value: number
  description: string
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  minOrderValue: number
  isActive: boolean
  targetProducts: string[]
  targetCategories: string[]
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    name: "Desconto Fitness",
    code: "FITNESS20",
    type: "percentage",
    value: 20,
    description: "20% de desconto em produtos fitness",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    usageLimit: 100,
    usageCount: 45,
    minOrderValue: 50,
    isActive: true,
    targetProducts: [],
    targetCategories: ["Fitness"],
  },
  {
    id: "2",
    name: "Frete Grátis",
    code: "FRETEGRATIS",
    type: "freeShipping",
    value: 0,
    description: "Frete grátis para compras acima de R$ 100",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    usageLimit: 200,
    usageCount: 78,
    minOrderValue: 100,
    isActive: true,
    targetProducts: [],
    targetCategories: [],
  },
  {
    id: "3",
    name: "Primeira Compra",
    code: "BEMVINDA15",
    type: "percentage",
    value: 15,
    description: "15% de desconto para novos clientes",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    usageLimit: 500,
    usageCount: 123,
    minOrderValue: 0,
    isActive: true,
    targetProducts: [],
    targetCategories: [],
  },
  {
    id: "4",
    name: "Liquidação Íntima",
    code: "INTIMA50",
    type: "fixed",
    value: 50,
    description: "R$ 50 de desconto em moda íntima",
    startDate: "2024-01-10",
    endDate: "2024-01-20",
    usageLimit: 50,
    usageCount: 50,
    minOrderValue: 150,
    isActive: false,
    targetProducts: [],
    targetCategories: ["Íntima"],
  },
]

const promotionTypes = {
  percentage: { label: "Porcentagem", icon: Percent, format: (value: number) => `${value}%` },
  fixed: { label: "Valor Fixo", icon: Tag, format: (value: number) => `R$ ${value.toFixed(2)}` },
  freeShipping: { label: "Frete Grátis", icon: Gift, format: () => "Frete Grátis" },
}

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null)

  const [newPromotion, setNewPromotion] = useState<Omit<Promotion, "id" | "usageCount">>({
    name: "",
    code: "",
    type: "percentage",
    value: 0,
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    usageLimit: 100,
    minOrderValue: 0,
    isActive: true,
    targetProducts: [],
    targetCategories: [],
  })

  const filteredPromotions = promotions.filter((promotion) => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || promotion.type === selectedType
    const matchesStatus =
      selectedStatus === "all" || (selectedStatus === "active" ? promotion.isActive : !promotion.isActive)
    return matchesSearch && matchesType && matchesStatus
  })

  const handleAddPromotion = () => {
    const promotion: Promotion = {
      ...newPromotion,
      id: Date.now().toString(),
      usageCount: 0,
    }
    setPromotions([promotion, ...promotions])
    setNewPromotion({
      name: "",
      code: "",
      type: "percentage",
      value: 0,
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      usageLimit: 100,
      minOrderValue: 0,
      isActive: true,
      targetProducts: [],
      targetCategories: [],
    })
    setIsAddDialogOpen(false)
  }

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion)
  }

  const handleUpdatePromotion = () => {
    if (editingPromotion) {
      setPromotions(promotions.map((p) => (p.id === editingPromotion.id ? editingPromotion : p)))
      setEditingPromotion(null)
    }
  }

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter((p) => p.id !== id))
  }

  const togglePromotionStatus = (id: string) => {
    setPromotions(promotions.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)))
  }

  const copyPromotionCode = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const generateRandomCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  const activePromotions = promotions.filter((p) => p.isActive).length
  const totalUsage = promotions.reduce((sum, p) => sum + p.usageCount, 0)
  const expiringSoon = promotions.filter((p) => {
    const endDate = new Date(p.endDate)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 7 && diffDays > 0 && p.isActive
  }).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promoções</h1>
          <p className="text-muted-foreground">Gerencie cupons e campanhas promocionais</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Nova Promoção
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Promoção</DialogTitle>
              <DialogDescription>Crie uma nova campanha promocional</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Promoção</Label>
                  <Input
                    value={newPromotion.name}
                    onChange={(e) => setNewPromotion({ ...newPromotion, name: e.target.value })}
                    placeholder="Ex: Desconto Fitness"
                  />
                </div>
                <div>
                  <Label>Código do Cupom</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newPromotion.code}
                      onChange={(e) => setNewPromotion({ ...newPromotion, code: e.target.value.toUpperCase() })}
                      placeholder="Ex: FITNESS20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setNewPromotion({ ...newPromotion, code: generateRandomCode() })}
                    >
                      Gerar
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
                  placeholder="Descrição da promoção"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Desconto</Label>
                  <Select
                    value={newPromotion.type}
                    onValueChange={(value: "percentage" | "fixed" | "freeShipping") =>
                      setNewPromotion({
                        ...newPromotion,
                        type: value,
                        value: value === "freeShipping" ? 0 : newPromotion.value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                      <SelectItem value="freeShipping">Frete Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step={newPromotion.type === "percentage" ? "1" : "0.01"}
                    value={newPromotion.value}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, value: Number.parseFloat(e.target.value) || 0 })
                    }
                    disabled={newPromotion.type === "freeShipping"}
                    placeholder={newPromotion.type === "percentage" ? "20" : "50.00"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={newPromotion.startDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={newPromotion.endDate}
                    onChange={(e) => setNewPromotion({ ...newPromotion, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Limite de Uso</Label>
                  <Input
                    type="number"
                    value={newPromotion.usageLimit}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, usageLimit: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Valor Mínimo do Pedido (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newPromotion.minOrderValue}
                    onChange={(e) =>
                      setNewPromotion({ ...newPromotion, minOrderValue: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={newPromotion.isActive}
                  onCheckedChange={(checked) => setNewPromotion({ ...newPromotion, isActive: checked })}
                />
                <Label>Ativar promoção imediatamente</Label>
              </div>
              <Button
                onClick={handleAddPromotion}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Criar Promoção
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Promotion Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Promoções Ativas</CardTitle>
            <Tag className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activePromotions}</div>
            <p className="text-xs text-muted-foreground">Campanhas em andamento</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total de Usos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">Cupons utilizados</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Expirando em Breve</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{expiringSoon}</div>
            <p className="text-xs text-muted-foreground">Próximos 7 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {((totalUsage / promotions.reduce((sum, p) => sum + p.usageLimit, 0)) * 100 || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Uso vs limite total</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Promoções Ativas</TabsTrigger>
          <TabsTrigger value="all">Todas as Promoções</TabsTrigger>
          <TabsTrigger value="analytics">Análises</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {promotions
              .filter((p) => p.isActive)
              .map((promotion) => {
                const TypeIcon = promotionTypes[promotion.type].icon
                const usagePercentage = (promotion.usageCount / promotion.usageLimit) * 100
                const isExpiringSoon = new Date(promotion.endDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

                return (
                  <Card key={promotion.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                            <TypeIcon className="h-5 w-5" />
                            {promotion.name}
                          </CardTitle>
                          <CardDescription className="mt-1">{promotion.description}</CardDescription>
                        </div>
                        {isExpiringSoon && <Badge variant="destructive">Expira em breve</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{promotion.code}</code>
                            <Button variant="ghost" size="sm" onClick={() => copyPromotionCode(promotion.code)}>
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-accent">
                              {promotionTypes[promotion.type].format(promotion.value)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Uso</span>
                            <span className="text-card-foreground">
                              {promotion.usageCount} / {promotion.usageLimit}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-accent h-2 rounded-full transition-all"
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Válido até: {new Date(promotion.endDate).toLocaleDateString("pt-BR")}</span>
                          {promotion.minOrderValue > 0 && <span>Min: R$ {promotion.minOrderValue.toFixed(2)}</span>}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPromotion(promotion)}
                            className="flex-1"
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => togglePromotionStatus(promotion.id)}
                            className="flex-1"
                          >
                            <EyeOff className="mr-1 h-3 w-3" />
                            Desativar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar promoções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="percentage">Porcentagem</SelectItem>
                <SelectItem value="fixed">Valor Fixo</SelectItem>
                <SelectItem value="freeShipping">Frete Grátis</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Promotions List */}
          <div className="space-y-4">
            {filteredPromotions.map((promotion) => {
              const TypeIcon = promotionTypes[promotion.type].icon
              const usagePercentage = (promotion.usageCount / promotion.usageLimit) * 100

              return (
                <Card key={promotion.id} className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary rounded-full">
                          <TypeIcon className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-card-foreground">{promotion.name}</h3>
                            <Badge variant={promotion.isActive ? "default" : "secondary"}>
                              {promotion.isActive ? "Ativa" : "Inativa"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{promotion.description}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                            <span>Código: {promotion.code}</span>
                            <span>
                              Uso: {promotion.usageCount}/{promotion.usageLimit} ({usagePercentage.toFixed(1)}%)
                            </span>
                            <span>Válido até: {new Date(promotion.endDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent">
                            {promotionTypes[promotion.type].format(promotion.value)}
                          </p>
                          {promotion.minOrderValue > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Min: R$ {promotion.minOrderValue.toFixed(2)}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditPromotion(promotion)}>
                            <Edit className="mr-1 h-3 w-3" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => togglePromotionStatus(promotion.id)}>
                            {promotion.isActive ? (
                              <EyeOff className="mr-1 h-3 w-3" />
                            ) : (
                              <Eye className="mr-1 h-3 w-3" />
                            )}
                            {promotion.isActive ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePromotion(promotion.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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
                <CardTitle className="text-card-foreground">Tipos de Promoção</CardTitle>
                <CardDescription>Distribuição por tipo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(promotionTypes).map(([type, config]) => {
                  const count = promotions.filter((p) => p.type === type).length
                  const percentage = (count / promotions.length) * 100 || 0
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <config.icon className="h-4 w-4" />
                        <span className="text-card-foreground">{config.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{count} promoções</span>
                        <span className="font-medium text-card-foreground">{percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  )
                })}
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Performance das Promoções</CardTitle>
                <CardDescription>Top 5 mais utilizadas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {promotions
                  .sort((a, b) => b.usageCount - a.usageCount)
                  .slice(0, 5)
                  .map((promotion, index) => (
                    <div key={promotion.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 bg-primary rounded-full">
                          <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-card-foreground">{promotion.name}</p>
                          <p className="text-xs text-muted-foreground">{promotion.code}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-card-foreground">{promotion.usageCount} usos</p>
                        <p className="text-xs text-muted-foreground">
                          {((promotion.usageCount / promotion.usageLimit) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Promotion Dialog */}
      <Dialog open={!!editingPromotion} onOpenChange={() => setEditingPromotion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Promoção</DialogTitle>
            <DialogDescription>Atualize as informações da promoção</DialogDescription>
          </DialogHeader>
          {editingPromotion && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome da Promoção</Label>
                  <Input
                    value={editingPromotion.name}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Código do Cupom</Label>
                  <Input
                    value={editingPromotion.code}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, code: e.target.value.toUpperCase() })}
                  />
                </div>
              </div>
              <div>
                <Label>Descrição</Label>
                <Textarea
                  value={editingPromotion.description}
                  onChange={(e) => setEditingPromotion({ ...editingPromotion, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Desconto</Label>
                  <Select
                    value={editingPromotion.type}
                    onValueChange={(value: "percentage" | "fixed" | "freeShipping") =>
                      setEditingPromotion({ ...editingPromotion, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                      <SelectItem value="freeShipping">Frete Grátis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Valor</Label>
                  <Input
                    type="number"
                    step={editingPromotion.type === "percentage" ? "1" : "0.01"}
                    value={editingPromotion.value}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, value: Number.parseFloat(e.target.value) || 0 })
                    }
                    disabled={editingPromotion.type === "freeShipping"}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={editingPromotion.startDate}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Data de Fim</Label>
                  <Input
                    type="date"
                    value={editingPromotion.endDate}
                    onChange={(e) => setEditingPromotion({ ...editingPromotion, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Limite de Uso</Label>
                  <Input
                    type="number"
                    value={editingPromotion.usageLimit}
                    onChange={(e) =>
                      setEditingPromotion({ ...editingPromotion, usageLimit: Number.parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
                <div>
                  <Label>Valor Mínimo do Pedido (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editingPromotion.minOrderValue}
                    onChange={(e) =>
                      setEditingPromotion({
                        ...editingPromotion,
                        minOrderValue: Number.parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={editingPromotion.isActive}
                  onCheckedChange={(checked) => setEditingPromotion({ ...editingPromotion, isActive: checked })}
                />
                <Label>Promoção ativa</Label>
              </div>
              <Button
                onClick={handleUpdatePromotion}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Atualizar Promoção
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
