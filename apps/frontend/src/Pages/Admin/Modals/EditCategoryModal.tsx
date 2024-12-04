import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Category } from "../admin.d";
import { categoryService } from "../categoryService";
import { useToast } from "../../../components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  image: z.string().url().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  parentId: z.string().optional(),
});

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
  category: Category;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  categories,
  category,
}) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category.name,
      slug: category.slug,
      image: category.image || "",
      description: category.description || "",
      parentId: category.parentId?.toString() || "none", // Change default value to "none"
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await categoryService.updateCategory(category.id, {
        ...values,
        parentId: values.parentId === "none" ? null : parseInt(values.parentId), // Handle "none" value
      });
      toast({
        title: "Category updated successfully",
        variant: "default",
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-zinc-100">Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Name</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      className="bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-zinc-500 focus:ring-zinc-500" 
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            {/* Add other form fields similarly */}
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-200">Parent Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                        <SelectValue placeholder="Select a parent category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      <SelectItem value="none" className="text-zinc-100 hover:bg-zinc-700">None</SelectItem>
                      {categories
                        .filter((c) => c.id !== category.id)
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="text-zinc-100 hover:bg-zinc-700"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-zinc-800 border-zinc-700 text-zinc-100 hover:bg-zinc-700"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-red-500 text-white hover:bg-red-600"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
