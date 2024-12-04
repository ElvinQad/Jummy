import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { useToast } from "../../../components/ui/use-toast";
import { Category } from "./category";
import { categoryService } from "../categoryService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { ApiErrorResponse } from '../categoryService';

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  image: z.string().url().optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  parentId: z.string().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
}) => {
  const { toast } = useToast();
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

  const onSubmit = async (data: FormSchema) => {
    try {
      const categoryData = {
        ...data,
        parentId: data.parentId && data.parentId !== "0" ? parseInt(data.parentId) : undefined,
        image: data.image || undefined,
        description: data.description || undefined,
      };
      await categoryService.createCategory(categoryData);
      form.reset();
      onClose();
      onSuccess();
      toast({
        title: "Category created",
        variant: "default",
      });
    } catch (error: any) {
      const apiError = error.response?.data as ApiErrorResponse;
      toast({
        title: "Error creating category",
        description: apiError?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900/90 border-gray-800 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Create New Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Category name"
                      className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-blue-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Slug</FormLabel>
                  <FormControl>
                    <Input 
                      {...field}
                      placeholder="category-slug"
                      className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-blue-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Image URL</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="https://example.com/image.jpg"
                      className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-blue-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Description</FormLabel>
                  <FormControl>
                    <textarea 
                      {...field}
                      placeholder="Category description"
                      className="w-full min-h-[100px] bg-gray-800/50 border border-gray-700 text-gray-100 rounded-md p-2 focus:border-blue-500 transition-colors"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Parent Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-gray-800/50 border-gray-700 text-gray-100 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800/50 border-gray-700">
                        <SelectItem value="0" className="text-gray-100">None</SelectItem>
                        {categories.map(category => (
                          <SelectItem 
                            key={category.id} 
                            value={category.id.toString()}
                            className="text-gray-100"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                className="bg-green-600 hover:bg-green-700 transition-colors shadow-lg hover:shadow-green-500/20"
              >
                Create Category
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="hover:bg-gray-700 text-gray-100 transition-colors"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
