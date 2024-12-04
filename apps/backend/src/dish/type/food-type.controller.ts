import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FoodTypeService } from './food-type.service';
import { CreateFoodTypeDto, UpdateFoodTypeDto } from './dto/index';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Food Types')
@Controller('food-types')
export class FoodTypeController {
  constructor(private readonly foodTypeService: FoodTypeService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Create a new food type' })
  create(@Body() createFoodTypeDto: CreateFoodTypeDto) {
    return this.foodTypeService.create(createFoodTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all food types' })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.foodTypeService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a food type by id' })
  findOne(@Param('id') id: string) {
    return this.foodTypeService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update a food type' })
  update(@Param('id') id: string, @Body() updateFoodTypeDto: UpdateFoodTypeDto) {
    return this.foodTypeService.update(+id, updateFoodTypeDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Delete a food type' })
  remove(@Param('id') id: string) {
    return this.foodTypeService.remove(+id);
  }
}