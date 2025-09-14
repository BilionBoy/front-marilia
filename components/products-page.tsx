"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Package, Eye } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  description: string
  status: "active" | "inactive"
  image?: string
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Conjunto Fitness Rosa",
    category: "Fitness",
    price: 89.9,
    stock: 15,
    description: "Conjunto fitness feminino em tecido respirável",
    status: "active",
  },
  {
    id: "2",
    name: "Top Esportivo Preto",
    category: "Fitness",
    price: 45.9,
    stock: 23,
    description: "Top esportivo com bojo removível",
    status: "active",
  },
  {
    id: "3",
    name: "Legging Premium",
    category: "Fitness",
    price: 120.0,
    stock: 8,
    description: "Legging premium com tecnologia anti-celulite",
    status: "active",
  },
  {
    id: "4",
    name: "Kit Moda Íntima Deluxe",
    category: "Íntima",
    price: 156.8,
    stock: 5,
    description: "Kit completo com sutiã e calcinha em renda",
    status: "inactive",
  },
  {
    id: "5",
    name: "Sutiã Push-up Nude",
    category: "Íntima",
    price: 78.5,
    stock: 12,
    description: "Sutiã push-up em microfibra",
    status: "active",
  },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const categories = ["Fitness", "Íntima", "Acessórios"]

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    status: "active",
  })

  const handleAddProduct = () => {
    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
    }
    setProducts([...products, product])
    setNewProduct({
      name: "",
      category: "",
      price: 0,
      stock: 0,
      description: "",
      status: "active",
    })
    setShowAddForm(false)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const toggleProductStatus = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, status: p.status === "active" ? "inactive" : "active" } : p)),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">Gerencie seu catálogo de produtos</p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Produto
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Adicionar Novo Produto</CardTitle>
            <CardDescription>Preencha as informações do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Produto</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Ex: Conjunto Fitness Rosa"
              />
            </div>
            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={newProduct.category}
                onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: Number.parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label htmlFor="stock">Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: Number.parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Descrição do produto"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddProduct} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Adicionar Produto
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Todas as categorias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-card-foreground">{product.name}</CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant={product.category === "Fitness" ? "default" : "secondary"} className="text-xs">
                      {product.category}
                    </Badge>
                  </CardDescription>
                </div>
                <Badge variant={product.status === "active" ? "default" : "secondary"} className="ml-2">
                  {product.status === "active" ? "Ativo" : "Inativo"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-card-foreground">
                    R$ {product.price.toFixed(2).replace(".", ",")}
                  </span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Package className="mr-1 h-4 w-4" />
                    {product.stock} em estoque
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)} className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleProductStatus(product.id)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    {product.status === "active" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">Nenhum produto encontrado</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || selectedCategory !== "all"
              ? "Tente ajustar os filtros de busca"
              : "Comece adicionando seu primeiro produto"}
          </p>
        </div>
      )}

      {editingProduct && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Editar Produto</CardTitle>
            <CardDescription>Atualize as informações do produto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Nome do Produto</Label>
              <Input
                id="edit-name"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-category">Categoria</Label>
              <Select
                value={editingProduct.category}
                onValueChange={(value) => setEditingProduct({ ...editingProduct, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-price">Preço (R$)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Estoque</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={editingProduct.stock}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, stock: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleUpdateProduct} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Atualizar Produto
              </Button>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
