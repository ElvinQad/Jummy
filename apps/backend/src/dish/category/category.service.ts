import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: CreateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (existingCategory) {
      throw new ConflictException(`Category with slug ${data.slug} already exists`);
    }

    return this.prisma.category.create({
      data,
      include: {
        parent: true,
        subcategories: true,
      },
    });
  }

  async getCategories(includeSubcategories = true) {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      include: {
        subcategories: includeSubcategories,
        dishes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        subcategories: true,
        dishes: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    return category;
  }

  async updateCategory(id: number, data: UpdateCategoryDto) {
    if (data.slug) {
      const existingCategory = await this.prisma.category.findFirst({
        where: { 
          slug: data.slug,
          NOT: { id }
        },
      });

      if (existingCategory) {
        throw new ConflictException(`Category with slug ${data.slug} already exists`);
      }
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: {
        parent: true,
        subcategories: true,
      },
    });
  }

  async deleteCategory(id: number) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { subcategories: true },
    });

    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }

    if (category.subcategories.length > 0) {
      throw new ConflictException('Cannot delete category with subcategories');
    }

    return await this.prisma.category.delete({
      where: { id },
    });
  }
}