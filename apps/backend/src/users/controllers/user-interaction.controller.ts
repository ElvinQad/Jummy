import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { UserInteractionService } from '../services/user-interaction.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UserUpdatesDto, UserStatusUpdateDto } from '../dto/user-updates.dto';

@ApiTags('User Interactions')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserInteractionController {
  constructor(private readonly userInteractionService: UserInteractionService) {}

  @Get(':id/notifications')
  @ApiOperation({ summary: 'Get user notifications' })
  getUserNotifications(
    @Param('id') id: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ): Promise<any> {
    return this.userInteractionService.getUserNotifications(+id, skip, take);
  }

  @Get(':id/messages')
  getUserMessages(
    @Param('id') id: string,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
  ): Promise<any> {
    return this.userInteractionService.getUserMessages(+id, skip, take);
  }

  @Patch(':id/notifications/read-all')
  markAllNotificationsAsRead(@Param('id') id: string): Promise<any> {
    return this.userInteractionService.markAllNotificationsAsRead(+id);
  }

  @Patch(':id/messages/read-all')
  markAllMessagesAsRead(@Param('id') id: string): Promise<any> {
    return this.userInteractionService.markAllMessagesAsRead(+id);
  }

  @Post('notifications')
  createNotification(@Body() dto: CreateNotificationDto): Promise<any> {
    return this.userInteractionService.createNotification(dto);
  }

  @Post('messages')
  createMessage(@Body() dto: CreateMessageDto): Promise<any> {
    return this.userInteractionService.createMessage(dto);
  }

  @Get(':id/updates')
  @ApiOperation({ summary: 'Get user updates including notifications, messages, and orders' })
  getUserUpdates(@Param('id') id: string): Promise<UserUpdatesDto> {
    return this.userInteractionService.getUserUpdates(+id);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get lightweight user status updates' })
  getUserStatus(@Param('id') id: string): Promise<UserStatusUpdateDto> {
    return this.userInteractionService.getUserStatus(+id);
  }
}
