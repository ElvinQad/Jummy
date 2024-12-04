import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OnlineStatus } from '@prisma/client';

@Injectable()
export class ChefService {
  constructor(private prisma: PrismaService) {}

  async getChefProfile(userId: number) {
    const profile = await this.prisma.cookProfile.findFirst({
      where: { userId },
      include: {
        user: {
          select: {
            email: true,
            phone: true,
            onlineStatus: true,
          },
        },
      },
    });

    if (!profile) throw new NotFoundException('Chef profile not found');
    return profile;
  }

  async updateChefProfile(userId: number, data: any) {
    return this.prisma.cookProfile.update({
      where: { userId },
      data,
    });
  }

  async updateOnlineStatus(userId: number, status: OnlineStatus) {
    return this.prisma.cookProfile.update({
      where: { userId },
      data: { onlineStatus: status },
    });
  }

  async getChefOrders(cookId: number) {
    return this.prisma.orderItem.findMany({
      where: { cookId },
      include: {
        order: true,
        dish: true,
      },
    });
  }

  async getChefEarnings(cookId: number) {
    const profile = await this.prisma.cookProfile.findUnique({
      where: { id: cookId },
      select: { totalEarnings: true },
    });
    return profile?.totalEarnings || 0;
  }

  async getMainCategories() {
    return this.prisma.category.findMany({
      where: {
        parentId: null  // only main categories
      },
      select: {
        id: true,
        name: true,
        description: true,
        image: true
      }
    });
  }

  async getCategoryHierarchy() {
    const categories = await this.prisma.category.findMany({
      where: {
        parentId: null  // only main categories
      },
      select: {
        id: true,
        name: true,
        subcategories: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return categories;
  }
}
