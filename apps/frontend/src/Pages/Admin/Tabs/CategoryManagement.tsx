import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { RefreshCcw, ChevronRight, ChevronDown, Search } from "lucide-react";
import { useToast } from "../../../components/ui/use-toast";
import { Category } from "../admin";
import { categoryService } from "../categoryService";
import { CreateCategoryModal } from "../Modals/CreateCategoryModal";
import { EditCategoryModal } from "../Modals/EditCategoryModal";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  image: z.string().url().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  parentId: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CategoryRowProps {
  category: Category;
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
  level?: number;
  expanded: boolean;
  onToggle: (id: number) => void;
}

const CategoryRow: React.FC<CategoryRowProps> = ({
  category,
  onDelete,
  onEdit,
  level = 0,
  expanded,
  onToggle,
}): JSX.Element => {
  const hasSubcategories =
    category.subcategories && category.subcategories.length > 0;

  return (
    <>
      <TableRow className="border-border hover:bg-muted/50 transition-colors">
        <TableCell
          className="font-medium"
          style={{ paddingLeft: `${level * 2}rem` }}
        >
          {hasSubcategories && (
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-6 w-6 mr-2"
              onClick={() => onToggle(category.id)}
            >
              {expanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </Button>
          )}
          {category.id}
        </TableCell>
        <TableCell className="font-medium">
          {level > 0 && <span className="text-muted-foreground mr-2">↳</span>}
          {category.name}
        </TableCell>
        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
        <TableCell className="text-muted-foreground">
          {category.image ? (
            <img
              src={category.image}
              alt={category.name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            "—"
          )}
        </TableCell>
        <TableCell className="text-muted-foreground truncate max-w-xs">
          {category.description || "—"}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {new Date(category.createdAt).toLocaleDateString()}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {category.parentId || "—"}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(category)}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(category.id)}
            >
              Delete
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded &&
        hasSubcategories &&
        category.subcategories.map((subcategory) => (
          <CategoryRow
            key={subcategory.id}
            category={subcategory}
            onDelete={onDelete}
            onEdit={onEdit}
            level={level + 1}
            expanded={expanded}
            onToggle={onToggle}
          />
        ))}
    </>
  );
};

const CategoryManagement: React.FC = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set()
  );
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: "",
      description: "",
      parentId: "",
    },
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      setCategories(categories.filter((category) => category.id !== id));
      toast({
        title: "Category deleted",
        variant: "default",
      });
    } catch (error: any) {
      const apiError = error.response?.data;
      toast({
        title: "Error deleting category",
        description: apiError?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const toggleCategory = (id: number) => {
    setExpandedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const filteredCategories = categories.filter((category) => {
    const matchesSearch = (cat: Category): boolean => {
      const nameMatch = cat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const slugMatch = cat.slug
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const subcategoriesMatch =
        cat.subcategories?.some(matchesSearch) || false;
      return nameMatch || slugMatch || subcategoriesMatch;
    };
    return matchesSearch(category);
  });

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-background/40 p-8 space-y-8">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Categories</span>
                <span className="text-2xl font-bold">{categories.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search categories..."
                className="pl-10 bg-background/50 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              + Create Category
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="font-semibold text-base py-4">ID</TableHead>
                  <TableHead className="font-semibold text-base py-4">Name</TableHead>
                  <TableHead className="font-semibold text-base py-4">Slug</TableHead>
                  <TableHead className="font-semibold text-base py-4">Image</TableHead>
                  <TableHead className="font-semibold text-base py-4">Description</TableHead>
                  <TableHead className="font-semibold text-base py-4">Created</TableHead>
                  <TableHead className="font-semibold text-base py-4">Parent</TableHead>
                  <TableHead className="text-right font-semibold text-base py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                        Loading categories...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No categories found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <CategoryRow
                      key={category.id}
                      category={category}
                      onDelete={handleDeleteCategory}
                      onEdit={setEditingCategory}
                      expanded={expandedCategories.has(category.id)}
                      onToggle={toggleCategory}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <CreateCategoryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={loadCategories}
        categories={categories}
      />

      {editingCategory && (
        <EditCategoryModal
          isOpen={!!editingCategory}
          onClose={() => setEditingCategory(null)}
          onSuccess={() => {
            loadCategories();
            setEditingCategory(null);
          }}
          categories={categories}
          category={editingCategory}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
