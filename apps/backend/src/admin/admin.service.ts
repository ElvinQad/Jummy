import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<any[]> {
    const users = await this.prisma.user.findMany({
      where: {
        cookProfile: null
      },
      include: {
        profile: true,
        lastSeen: true
      }
    });
    return users as any[];
  }

  async getAllChefs(): Promise<any[]> {
    const chefs = await this.prisma.user.findMany({
      where: {
        cookProfile: {
          isNot: null
        }
      },
      include: {
        profile: {
          include: {
            addresses: true
          }
        },
        lastSeen: true,
        cookProfile: true
      }
    });
    return chefs as any[];
  }

  async getUserById(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            addresses: true
          }
        },
        cart: true,
        orders: true,
        favorites: true,
        cookProfile: true,
        chefApplication: true,
        notifications: true,
        conversations: true,
        sentMessages: true,
        receivedMessages: true
      }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  public async deleteUser(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  public async updateUser(id: number, updateData: any): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        phone: updateData.phone,
        email: updateData.email,
        profile: {
          update: {
            firstName: updateData.firstName,
            lastName: updateData.lastName,
          }
        }
      },
      include: {
        profile: true,
        lastSeen: true
      }
    });
  }
}
