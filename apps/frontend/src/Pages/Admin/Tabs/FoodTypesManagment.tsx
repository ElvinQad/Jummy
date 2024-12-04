import { useState, useEffect, useCallback } from 'react';
import { FoodType, foodTypeService } from '../foodTypeService';
import { Button } from '../../../components/ui/button';
import { useToast } from '../../../components/ui/use-toast';
import { FoodTypeModal } from '../Modals/FoodTypeModal';
import { RefreshCcw, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";

interface ApiErrorResponse {
  message: string;
  statusCode?: number;
}

export default function FoodTypes() {
  const [foodTypes, setFoodTypes] = useState<FoodType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFoodType, setEditingFoodType] = useState<FoodType | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const loadFoodTypes = useCallback(async (page: number) => {
    try {
      setLoading(true);
      const response = await foodTypeService.getFoodTypes(page);
      setFoodTypes(response.data);
      setTotalPages(response.meta.pageCount);
    } catch (error: any) {
      const apiError = error.response?.data;
      toast({
        variant: "destructive",
        title: "Error loading food types",
        description: apiError?.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadFoodTypes(currentPage);
  }, [currentPage, loadFoodTypes]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this food type?')) {
      try {
        await foodTypeService.deleteFoodType(id);
        toast({
          title: "Success",
          description: "Food type deleted successfully"
        });
        loadFoodTypes(currentPage);
      } catch (error: any) {
        const apiError = error.response?.data;
        toast({
          variant: "destructive",
          title: "Error deleting food type",
          description: apiError?.message || "An unexpected error occurred"
        });
      }
    }
  }, [currentPage, loadFoodTypes, toast]);

  const handleModalSubmit = async (data: { name: string; slug: string; description?: string; image?: string }) => {
    try {
      if (editingFoodType) {
        await foodTypeService.updateFoodType(editingFoodType.id, data);
        toast({
          title: "Success",
          description: "Food type updated successfully"
        });
      } else {
        await foodTypeService.createFoodType(data);
        toast({
          title: "Success",
          description: "Food type created successfully"
        });
      }
      loadFoodTypes(currentPage);
      setIsModalOpen(false);
      setEditingFoodType(undefined);
    } catch (error: any) {
      const apiError = error.response?.data;
      toast({
        variant: "destructive",
        title: "Error saving food type",
        description: apiError?.message || "An unexpected error occurred"
      });
    }
  };

  const openEditModal = (foodType: FoodType) => {
    setEditingFoodType(foodType);
    setIsModalOpen(true);
  };

  const filteredFoodTypes = foodTypes.filter(foodType => 
    foodType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foodType.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    foodType.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background/40 p-8 space-y-8">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-6">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Total Food Types</span>
                <span className="text-2xl font-bold">{foodTypes.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search food types..."
                className="pl-10 bg-background/50 border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setEditingFoodType(undefined);
                setIsModalOpen(true);
              }}
              className="bg-primary hover:bg-primary/90"
            >
              + Add Food Type
            </Button>
          </div>

          <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm shadow-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-muted/50">
                  <TableHead className="font-semibold text-base py-4">ID</TableHead>
                  <TableHead className="font-semibold text-base py-4">Name</TableHead>
                  <TableHead className="font-semibold text-base py-4">Slug</TableHead>
                  <TableHead className="font-semibold text-base py-4">Description</TableHead>
                  <TableHead className="font-semibold text-base py-4">Dishes Count</TableHead>
                  <TableHead className="text-right font-semibold text-base py-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCcw className="h-4 w-4 animate-spin" />
                        Loading food types...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredFoodTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                      No food types found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredFoodTypes.map((foodType) => (
                    <TableRow key={foodType.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{foodType.id}</TableCell>
                      <TableCell>{foodType.name}</TableCell>
                      <TableCell className="text-muted-foreground">{foodType.slug}</TableCell>
                      <TableCell className="text-muted-foreground">{foodType.description || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{foodType._count?.dishes || 0}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(foodType)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(foodType.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <FoodTypeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFoodType(undefined);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingFoodType}
      />
    </div>
  );
}
