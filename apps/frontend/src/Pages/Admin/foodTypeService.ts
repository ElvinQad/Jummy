import { api } from '../../lib/axios';


export const foodTypeService = {
  getFoodTypes: async (page = 1, limit = 10) => {
    const response = await api.get<PaginatedResponse<FoodType>>(`/food-types?page=${page}&limit=${limit}`);
    return response.data;
  },

  getFoodType: async (id: number) => {
    const response = await api.get<FoodType>(`/food-types/${id}`);
    return response.data;
  },

  createFoodType: async (data: CreateFoodTypeDto) => {
    const response = await api.post<FoodType>('/food-types', data);
    return response.data;
  },

  updateFoodType: async (id: number, data: Partial<CreateFoodTypeDto>) => {
    const response = await api.patch<FoodType>(`/food-types/${id}`, data);
    return response.data;
  },

  deleteFoodType: async (id: number) => {
    const response = await api.delete(`/food-types/${id}`);
    return response.data;
  },
};
