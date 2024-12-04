import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserDataService {
  constructor(private readonly prisma: PrismaService) {}
 
 
  async create(dto: CreateUserDto): Promise<any> {
    const hashedPassword = dto.password
      ? await bcrypt.hash(dto.password, 10)
      : null;

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        isChef: dto.isChef || false,
        profile: {
          create: {
            firstName: dto.profile.firstName,
            lastName: dto.profile.lastName,
            avatar: dto.profile.avatar,
            addresses: dto.profile.address
              ? {
                  create: {
                    title: dto.profile.address.title ?? '',
                    addressLine1: dto.profile.address.addressLine1 ?? '',
                    district: dto.profile.address.district ?? '',
                    city: dto.profile.address.city ?? '',
                  },
                }
              : undefined,
          },
        },
      },
      include: {
        profile: {
          include: {
            addresses: true,
          },
        },
      },
    });

    return user;
  }





  async update(id: number, dto: UpdateUserDto): Promise<any> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        phone: dto.phone,
        googleId: dto.googleId,
        isChef: dto.isChef,
        profile: dto.profile
          ? {
              update: {
                firstName: dto.profile.firstName,
                lastName: dto.profile.lastName,
                avatar: dto.profile.avatar,
                // Removed 'addresses' update from here
              },
            }
          : undefined,
      },
      include: {
        profile: {
          include: {
            addresses: true,
          },
        },
      },
    });

    // Handle address updates separately
    if (dto.profile?.addresses) {
      for (const addr of dto.profile.addresses) {
        if (addr.id) {
          // Update existing address
          await this.prisma.address.update({
            where: { id: addr.id },
            data: {
              title: addr.title ?? '',
              addressLine1: addr.addressLine ?? '',
              city: addr.city ?? '',
              district: addr.district ?? '',
            },
          });
        } else {
          // Create new address
          await this.prisma.address.create({
            data: {
              title: addr.title ?? '',
              addressLine1: addr.addressLine ?? '',
              city: addr.city ?? '',
              district: addr.district ?? '',
              isDefault: true,
              profileId: user.profile?.id ?? 0,
            },
          });
        }
      }
    }

    return user;
  }

  async findOne(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            addresses: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async findByEmail(email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            addresses: true,
          },
        },
      },
    });
    return user ? user : null;
  }
  async isAdmin(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isAdmin: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return { isAdmin: user.isAdmin };
  }

  async isChef(id: number): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { isChef: true }
    });
    if (!user) throw new NotFoundException('User not found');
    return { isChef: user.isChef };
  }
  async delete(id: number): Promise<any> {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    return user;
  }

  async getUserItemsAndCounts(userId: number): Promise<any> {
    try {
      const [cartItems, favorites] = await Promise.all([
        // Get cart items with limit
        this.prisma.cartItem.findMany({
          where: {
            cart: {
              userId: userId
            }
          },
          include: {
            dish: true
          },
          take: 10
        }),
        // Get favorites with limit
        this.prisma.userFavorite.findMany({
          where: {
            userId: userId
          },
          include: {
            dish: true
          },
          take: 10
        })
      ]);

      // Transform the data
      const transformedCartItems = cartItems.map(item => ({
        id: item.dishId,
        name: item.dish?.name ?? 'Unknown',
        price: item.dish?.price ?? 0,
        quantity: item.quantity,
        image: item.dish?.images 
          ? (JSON.parse(item.dish.images as string)[0]?.url ?? '/api/placeholder/80/80')
          : '/api/placeholder/80/80'
      }));

      const transformedFavorites = favorites.map(fav => ({
        id: fav.dishId,
        name: fav.dish?.name ?? 'Unknown',
        price: fav.dish?.price ?? 0,
        image: fav.dish?.images
          ? (JSON.parse(fav.dish.images as string)[0]?.url ?? '/api/placeholder/80/80')
          : '/api/placeholder/80/80'
      }));

      // Get total counts
      const [totalCartItems, totalFavorites] = await Promise.all([
        this.prisma.cartItem.count({
          where: {
            cart: {
              userId: userId
            }
          }
        }),
        this.prisma.userFavorite.count({
          where: {
            userId: userId
          }
        })
      ]);

      return {
        cartItems: transformedCartItems,
        favorites: transformedFavorites,
        counts: {
          cartItems: totalCartItems,
          favorites: totalFavorites
        }
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch user items and counts');
    }
  }
}
