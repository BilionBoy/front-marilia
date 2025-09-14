"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Tag, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { CategoriaProduto } from "@/app/@types/CategoriaProduto";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoriaProduto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoriaProduto | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const filteredCategories = categories.filter((category) =>
    category.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [newCategory, setNewCategory] = useState({
    descricao: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.get<CategoriaProduto[]>("/categoria_produtos");
      setCategories(data);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.descricao.trim()) return;

    try {
      setSubmitting(true);
      const createdCategory = await api.post<CategoriaProduto>(
        "/categoria_produtos",
        newCategory
      );
      setCategories([...categories, createdCategory]);
      setNewCategory({ descricao: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCategory = (category: CategoriaProduto) => {
    setEditingCategory(category);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.descricao.trim()) return;

    try {
      setSubmitting(true);
      const updatedCategory = await api.put<CategoriaProduto>(
        `/categoria_produtos/${editingCategory.id}`,
        {
          descricao: editingCategory.descricao,
        }
      );
      setCategories(
        categories.map((c) =>
          c.id === editingCategory.id ? updatedCategory : c
        )
      );
      setEditingCategory(null);
    } catch (error) {
      console.error("Erro ao atualizar categoria:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta categoria?")) return;

    try {
      await api.delete(`/categoria_produtos/${id}`);
      setCategories(categories.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Erro ao excluir categoria:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">
          Carregando categorias...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias dos seus produtos
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Categoria
        </Button>
      </div>

      {showAddForm && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Adicionar Nova Categoria</CardTitle>
            <CardDescription>
              Preencha as informações da categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição da Categoria</Label>
              <Input
                id="descricao"
                value={newCategory.descricao}
                onChange={(e) => setNewCategory({ descricao: e.target.value })}
                placeholder="Ex: Comidas, Bebidas, Roupas"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddCategory}
                disabled={submitting || !newCategory.descricao.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adicionando...
                  </>
                ) : (
                  "Adicionar Categoria"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddForm(false)}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar categorias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-card-foreground flex items-center">
                    <Tag className="mr-2 h-5 w-5" />
                    {category.descricao}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <Badge variant="secondary" className="text-xs">
                      ID: {category.id}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="flex-1"
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
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

      {filteredCategories.length === 0 && !loading && (
        <div className="text-center py-12">
          <Tag className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium text-foreground">
            Nenhuma categoria encontrada
          </h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm
              ? "Tente ajustar o termo de busca"
              : "Comece adicionando sua primeira categoria"}
          </p>
        </div>
      )}

      {editingCategory && (
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Editar Categoria</CardTitle>
            <CardDescription>
              Atualize as informações da categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="edit-descricao">Descrição da Categoria</Label>
              <Input
                id="edit-descricao"
                value={editingCategory.descricao}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    descricao: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateCategory}
                disabled={submitting || !editingCategory.descricao.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Atualizar Categoria"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditingCategory(null)}
                disabled={submitting}
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
