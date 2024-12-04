import { Controller, Get, Put, Body, Param } from '@nestjs/common';
import { ChefService } from './chef.service';
import { OnlineStatus } from '@prisma/client';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('chefs')
@Controller('chefs')
export class ChefController {
  constructor(private chefService: ChefService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get chef profile', description: 'Retrieves the profile information of a chef' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'Chef profile retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Chef profile not found' })
  getProfile(@Param('userId') userId: number) {
    return this.chefService.getChefProfile(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update chef profile', description: 'Updates the profile information of a chef' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiBody({ description: 'Profile data to update' })
  @ApiResponse({ status: 200, description: 'Chef profile updated successfully' })
  @ApiResponse({ status: 404, description: 'Chef profile not found' })
  updateProfile(@Param('userId') userId: number, @Body() data: any) {
    return this.chefService.updateChefProfile(userId, data);
  }

  @Put('status')
  @ApiOperation({ summary: 'Update chef online status', description: 'Updates the online status of a chef' })
  @ApiParam({ name: 'userId', type: 'number', description: 'ID of the user' })
  @ApiBody({ enum: OnlineStatus, description: 'New online status' })
  @ApiResponse({ status: 200, description: 'Status updated successfully' })
  updateOnlineStatus(
    @Param('userId') userId: number,
    @Body('status') status: OnlineStatus,
  ) {
    return this.chefService.updateOnlineStatus(userId, status);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Get chef orders', description: 'Retrieves all orders assigned to a chef' })
  @ApiParam({ name: 'cookId', type: 'number', description: 'ID of the cook' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  getOrders(@Param('cookId') cookId: number) {
    return this.chefService.getChefOrders(cookId);
  }

  @Get('earnings')
  @ApiOperation({ summary: 'Get chef earnings', description: 'Retrieves the total earnings of a chef' })
  @ApiParam({ name: 'cookId', type: 'number', description: 'ID of the cook' })
  @ApiResponse({ status: 200, description: 'Earnings retrieved successfully' })
  getEarnings(@Param('cookId') cookId: number) {
    return this.chefService.getChefEarnings(cookId);
  }

  @Get('categories/main')
  @ApiOperation({ summary: 'Get main categories', description: 'Retrieves all main food categories' })
  @ApiResponse({ status: 200, description: 'Main categories retrieved successfully' })
  getMainCategories() {
    return this.chefService.getMainCategories();
  }

  @Get('categories/hierarchy')
  @ApiOperation({ summary: 'Get category hierarchy', description: 'Retrieves the complete category hierarchy' })
  @ApiResponse({ status: 200, description: 'Category hierarchy retrieved successfully' })
  getCategoryHierarchy() {
    return this.chefService.getCategoryHierarchy();
  }
}
