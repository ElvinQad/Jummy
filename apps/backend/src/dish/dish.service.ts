import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDishDto } from './dto/dish.dto';


@Injectable()
export class DishService {
  constructor(private prisma: PrismaService) {}

  async createDish(data: {
    cookId: number;
    name: string;
    description?: string;
    price: number;
    preparationTime: number;
    categoryIds: number[]; // Array of category IDs
    images?: string[];
  }) {
    const { categoryIds, ...dishData } = data;

    return this.prisma.dish.create({
      data: {
        ...dishData,
        images: dishData.images || [],
        categories: {
          create: categoryIds.map(categoryId => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async updateDishCategories(dishId: bigint, categoryIds: number[]) {
    // First, remove all existing category relationships
    await this.prisma.dishCategory.deleteMany({
      where: { dishId },
    });

    // Then create new relationships
    return this.prisma.dish.update({
      where: { id: dishId },
      data: {
        categories: {
          create: categoryIds.map(categoryId => ({
            category: {
              connect: { id: categoryId },
            },
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getDishesInCategory(categoryId: number) {
    return this.prisma.dish.findMany({
      where: {
        categories: {
          some: {
            categoryId,
          },
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async getDishes(filters: {
    categoryId?: number;
    cookId?: number;
    available?: boolean;
  }) {
    return this.prisma.dish.findMany({
      where: {
        ...(filters.categoryId && {
          categories: {
            some: { categoryId: filters.categoryId }
          }
        }),
        ...(filters.cookId && { cookId: filters.cookId }),
        ...(filters.available && { isAvailable: true }),
      },
      include: {
        categories: {
          include: { category: true }
        },
        cook: {
          select: {
            businessName: true,
            rating: true
          }
        }
      }
    });
  }

  async getDishById(id: bigint) {
    const dish = await this.prisma.dish.findUnique({
      where: { id },
      include: {
        categories: {
          include: { category: true }
        },
        cook: {
          select: {
            businessName: true,
            rating: true
          }
        }
      }
    });

    if (!dish) throw new NotFoundException(`Dish #${id} not found`);
    return dish;
  }

  async updateDish(id: bigint, data: UpdateDishDto) {
    const { categoryIds, ...updateData } = data;
    
    const dish = await this.prisma.dish.update({
      where: { id },
      data: {
        ...updateData,
        ...(categoryIds && {
          categories: {
            deleteMany: {},
            create: categoryIds.map(categoryId => ({
              category: { connect: { id: categoryId } }
            }))
          }
        })
      },
      include: {
        categories: {
          include: { category: true }
        }
      }
    });

    if (!dish) throw new NotFoundException(`Dish #${id} not found`);
    return dish;
  }

  async deleteDish(id: bigint) {
    await this.prisma.dish.delete({
      where: { id }
    });
  }
}