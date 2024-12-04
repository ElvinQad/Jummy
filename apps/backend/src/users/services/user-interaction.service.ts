import { Injectable, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { NotificationType } from '@prisma/client';
import { UserUpdatesDto, UserStatusUpdateDto } from '../dto/user-updates.dto';

@Injectable()
export class UserInteractionService {
  private readonly logger = new Logger(UserInteractionService.name);

  constructor(private readonly prisma: PrismaService) {}

  @Cron('*/10 * * * *')
  async updateOnlineStatuses(): Promise<void> {
    this.logger.debug('Running updateOnlineStatuses job');

    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    try {
      await this.prisma.$transaction([
        // Set users to ONLINE if active within last 10 minutes
        this.prisma.user.updateMany({
          where: {
            lastSeen: {
              timestamp: {
                gte: tenMinutesAgo,
              },
            },
          },
          data: {
            onlineStatus: 'ONLINE',
          },
        }),
        // Set others to OFFLINE
        this.prisma.user.updateMany({
          where: {
            OR: [
              { lastSeen: null },
              { lastSeen: { timestamp: { lt: tenMinutesAgo } } },
            ],
          },
          data: {
            onlineStatus: 'OFFLINE',
          },
        }),
      ]);
    } catch (error) {
      this.logger.error('Error updating online statuses:', error);
    }
  }

  async getUserNotifications(userId: number, skip = 0, take = 10): Promise<any> {
    this.logger.debug(`Fetching notifications for user ${userId} with skip=${skip} and take=${take}`);
    
    try {
      // Validate user exists
      const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const [notifications, total, unreadCount] = await Promise.all([
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          skip: Number(skip),
          take: Number(take),
          include: {
            user: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  }
                }
              },
            },
          },
        }),
        this.prisma.notification.count({ where: { userId } }),
        this.prisma.notification.count({ where: { userId, isRead: false } })
      ]);

      this.logger.debug(`Found ${notifications.length} notifications, total: ${total}, unread: ${unreadCount}`);
      return { notifications, total, unreadCount };

    } catch (error) {
      this.logger.error(`Error fetching notifications for user ${userId}:`, (error as any).stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch notifications');
    }
  }

  async getUserMessages(userId: number, skip = 0, take = 10): Promise<any> {
    this.logger.debug(`Fetching messages for user ${userId} with skip=${skip} and take=${take}`);
    
    try {
      const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
      if (!userExists) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // First, get distinct conversation IDs
      const conversations = await this.prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        distinct: ['conversationId'],
        orderBy: { createdAt: 'desc' },
        skip: Number(skip),
        take: Number(take),
        select: { conversationId: true }
      });

      // Then, get messages for each conversation
      const conversationsWithMessages = await Promise.all(
        conversations.map(async (conv) => {
          const messages = await this.prisma.message.findMany({
            where: { conversationId: conv.conversationId },
            orderBy: { createdAt: 'desc' },
            include: {
              sender: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true,
                    }
                  }
                },
              },
              receiver: {
                select: {
                  id: true,
                  email: true,
                  profile: {
                    select: {
                      firstName: true,
                      lastName: true,
                      avatar: true,
                    }
                  }
                },
              },
            },
          });

          return {
            conversationId: conv.conversationId,
            messages,
            lastMessage: messages[0],
            unreadCount: messages.filter(m => !m.isRead && m.receiverId === userId).length
          };
        })
      );

      const [totalConversations, totalUnreadMessages] = await Promise.all([
        this.prisma.message.groupBy({
          by: ['conversationId'],
          where: {
            OR: [
              { senderId: userId },
              { receiverId: userId },
            ],
          },
        }).then(groups => groups.length),
        this.prisma.message.count({
          where: {
            receiverId: userId,
            isRead: false,
          },
        })
      ]);

      this.logger.debug(`Found ${conversationsWithMessages.length} conversations, total unread: ${totalUnreadMessages}`);
      return {
        conversations: conversationsWithMessages,
        total: totalConversations,
        unreadCount: totalUnreadMessages
      };

    } catch (error) {
      this.logger.error(`Error fetching messages for user ${userId}:`, (error as any).stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to fetch messages');
    }
  }

  async markAllNotificationsAsRead(userId: number): Promise<any> {
    await this.prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false 
      },
      data: { isRead: true },
    });
    return { success: true };
  }

  async markAllMessagesAsRead(userId: number): Promise<any> {
    await this.prisma.message.updateMany({
      where: { 
        receiverId: userId,
        isRead: false 
      },
      data: { isRead: true },
    });
    return { success: true };
  }
  async createNotification(dto: CreateNotificationDto): Promise<any> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: dto.title,
          message: dto.message,
          type: dto.type || NotificationType.NEW_MESSAGE,
          userId: dto.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                }
              }
            }
          }
        }
      });
      
      return notification;
    } catch (error) {
      this.logger.error(`Error creating notification:`, error);
      throw new InternalServerErrorException('Failed to create notification');
    }
  }

  async createMessage(dto: CreateMessageDto): Promise<any> {
    try {
      const message = await this.prisma.message.create({
        data: {
          content: dto.content,
          senderId: dto.senderId,
          receiverId: dto.receiverId,
          conversationId: dto.conversationId,
        },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                }
              }
            }
          },
          receiver: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  firstName: true,
                  lastName: true,
                  avatar: true,
                }
              }
            }
          }
        }
      });
      
      return message;
    } catch (error) {
      this.logger.error(`Error creating message:`, error);
      throw new InternalServerErrorException('Failed to create message');
    }
  }

  async getUserUpdates(userId: number): Promise<UserUpdatesDto> {
    try {
      const [
        newNotifications,
        newMessages,
        recentOrders,
        latestNotifications,
        latestMessages,
      ] = await Promise.all([
        // Count unread notifications
        this.prisma.notification.count({
          where: { userId, isRead: false }
        }),
        // Count unread messages
        this.prisma.message.count({
          where: { receiverId: userId, isRead: false }
        }),
        // Get recent orders
        this.prisma.order.findMany({
          where: { customerId: userId },
          orderBy: { updatedAt: 'desc' },
          take: 5,
          select: {
            id: true,
            status: true,
            totalAmount: true,
            updatedAt: true
          }
        }),
        // Get latest notifications
        this.prisma.notification.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          take: 5
        }),
        // Get latest messages
        this.prisma.message.findMany({
          where: { receiverId: userId },
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            sender: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    firstName: true,
                    lastName: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        })
      ]);

 

      return {
        newNotifications,
        newMessages,
        recentOrders,
        latestNotifications,
        latestMessages,
      };
    } catch (error) {
      this.logger.error(`Error fetching updates for user ${userId}:`, error);
      throw new InternalServerErrorException('Failed to fetch user updates');
    }
  }

  async getUserStatus(userId: number): Promise<UserStatusUpdateDto> {
    try {
      const [
        notificationsData,
        messagesData,
        ordersData
      ] = await Promise.all([
        // Get notifications count and last notification timestamp
        this.prisma.$transaction([
          this.prisma.notification.count({
            where: { userId, isRead: false }
          }),
          this.prisma.notification.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
          })
        ]),
        // Get messages count and last message timestamp
        this.prisma.$transaction([
          this.prisma.message.count({
            where: { receiverId: userId, isRead: false }
          }),
          this.prisma.message.findFirst({
            where: { receiverId: userId },
            orderBy: { createdAt: 'desc' },
            select: { createdAt: true }
          })
        ]),
        // Get pending orders count and last order update
        this.prisma.$transaction([
          this.prisma.order.count({
            where: { 
              customerId: userId,
              status: { notIn: ['DELIVERED', 'CANCELLED'] }
            }
          }),
          this.prisma.order.findFirst({
            where: { customerId: userId },
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true }
          })
        ])
      ]);

      // Update last seen
      await this.prisma.lastSeen.update({
        where: { userId },
        data: { timestamp: new Date() }
      });

      return {
        notificationsCount: notificationsData[0],
        messagesCount: messagesData[0],
        ordersCount: ordersData[0],
        lastNotificationAt: notificationsData[1]?.createdAt,
        lastMessageAt: messagesData[1]?.createdAt,
        lastOrderUpdateAt: ordersData[1]?.updatedAt
      };
    } catch (error) {
      this.logger.error(`Error fetching user status for ${userId}:`, error);
      throw new InternalServerErrorException('Failed to fetch user status');
    }
  }
}
