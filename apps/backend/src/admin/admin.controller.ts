import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  ValidationPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard } from '../auth/guards/admin.guard';
import { ApiTags, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(AdminGuard)
@Controller('admin')
export class AdminController {
 public constructor(private readonly adminService: AdminService) {}

  @Get('users')
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all users' })
  public getAllUsers(): Promise<any[]> {
    return this.adminService.getAllUsers();
  }

  @Get('chefs')
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns all chefs' })
  public getAllChefs(): Promise<any[]> {
    return this.adminService.getAllChefs();
  }

  @Get('users/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Returns user details' })
  public getUserById(@Param('id', ParseIntPipe) id: number): Promise<any> {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Updates user profile' })
  public updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) updateData: any
  ): Promise<any> {
    return this.adminService.updateUser(id, updateData);
  }

  @Delete('users/:id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User deleted' })
  public async deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.adminService.deleteUser(id);
  }
}
