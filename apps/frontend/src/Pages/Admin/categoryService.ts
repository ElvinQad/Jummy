import { api } from '../../lib/axios';
import { Category, CreateCategoryDto, UpdateCategoryDto } from './category';

export const categoryService = {
  getCategories: async (includeSubcategories = true) => {
    const response = await api.get<Category[]>(`/categories?includeSubcategories=${includeSubcategories}`);
    return response.data;
  },

  getCategory: async (id: number) => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (data: CreateCategoryDto) => {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  updateCategory: async (id: number, data: UpdateCategoryDto) => {
    const response = await api.put<Category>(`/categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
