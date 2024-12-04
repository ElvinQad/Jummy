import { ApiProperty } from '@nestjs/swagger';
import { Order, Notification, Message } from '@prisma/client';

export class UserUpdatesDto {
  @ApiProperty()
  newNotifications?: number;

  @ApiProperty()
  newMessages?: number;

  @ApiProperty()
  recentOrders?: Partial<Order>[];

  @ApiProperty()
  latestNotifications?: Partial<Notification>[];

  @ApiProperty()
  latestMessages?: Partial<Message>[];

  @ApiProperty()
  lastSeenUpdated?: boolean;
}

export class UserStatusUpdateDto {
  @ApiProperty()
  notificationsCount?: number;

  @ApiProperty()
  messagesCount?: number;

  @ApiProperty()
  ordersCount?: number;

  @ApiProperty()
  lastNotificationAt?: Date;

  @ApiProperty()
  lastMessageAt?: Date;

  @ApiProperty()
  lastOrderUpdateAt?: Date;
}
