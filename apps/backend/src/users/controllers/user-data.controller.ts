import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserDataService } from '../services/user-data.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User Data')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserDataController {
  constructor(private readonly userDataService: UserDataService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userDataService.create(createUserDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<any> {
    return this.userDataService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userDataService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.userDataService.delete(+id);
  }

  @Get(':id/is-admin')
  isAdmin(@Param('id') id: string): Promise<any> {
    return this.userDataService.isAdmin(+id);
  }

  @Get(':id/is-chef')
  isChef(@Param('id') id: string): Promise<any> {
    return this.userDataService.isChef(+id);
  }



  @Get(':id/items-and-counts')
  getUserItemsAndCounts(@Param('id') id: string): Promise<any> {
    return this.userDataService.getUserItemsAndCounts(+id);
  }
}
