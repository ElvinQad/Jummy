import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFoodTypeDto, UpdateFoodTypeDto } from './dto/index';

@Injectable()
export class FoodTypeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFoodTypeDto) {
    return this.prisma.foodType.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
      },
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    // Convert parameters to numbers and ensure they're valid
    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [total, foodTypes] = await Promise.all([
      this.prisma.foodType.count(),
      this.prisma.foodType.findMany({
        skip,
        take: limitNum,
        include: {
          _count: {
            select: { dishes: true },
          },
        },
      }),
    ]);

    return {
      data: foodTypes,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pageCount: Math.ceil(total / limitNum),
      },
    };
  }

  async findOne(id: number) {
    return this.prisma.foodType.findUnique({
      where: { id },
      include: {
        dishes: {
          include: {
            dish: true,
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateFoodTypeDto) {
    return this.prisma.foodType.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.foodType.delete({
      where: { id },
    });
  }
}