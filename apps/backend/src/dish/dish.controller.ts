import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { DishService } from './dish.service';
import { CreateDishDto, UpdateDishDto } from './dto/dish.dto';

@ApiTags('Dishes')
@Controller('dishes')
export class DishController {
  constructor(private readonly dishService: DishService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create a new dish',
    description: 'Creates a new dish with the provided details including categories, price, and preparation time.'
  })
  @ApiResponse({ status: 201, description: 'Dish has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid dish data provided.' })
  async createDish(@Body(ValidationPipe) createDishDto: CreateDishDto) {
    return this.dishService.createDish(createDishDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all dishes with filters',
    description: 'Retrieves a list of dishes. Can be filtered by category, cook, and availability.'
  })
  @ApiQuery({ name: 'categoryId', required: false, type: Number, description: 'Filter by category ID' })
  @ApiQuery({ name: 'cookId', required: false, type: Number, description: 'Filter by cook ID' })
  @ApiQuery({ name: 'available', required: false, type: Boolean, description: 'Filter by availability' })
  @ApiResponse({ status: 200, description: 'List of dishes retrieved successfully.' })
  async getDishes(
    @Query('categoryId', ParseIntPipe) categoryId?: number,
    @Query('cookId', ParseIntPipe) cookId?: number,
    @Query('available') available?: boolean,
  ) {
    return this.dishService.getDishes({ categoryId, cookId, available });
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get dish by ID',
    description: 'Retrieves detailed information about a specific dish.'
  })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 200, description: 'Dish details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  async getDish(@Param('id', ParseIntPipe) id: number) {
    return this.dishService.getDishById(BigInt(id));
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update dish',
    description: 'Updates an existing dish with the provided details.'
  })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 200, description: 'Dish has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  @ApiResponse({ status: 400, description: 'Invalid update data provided.' })
  async updateDish(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateDishDto: UpdateDishDto
  ) {
    return this.dishService.updateDish(BigInt(id), updateDishDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete dish',
    description: 'Removes a dish from the system.'
  })
  @ApiParam({ name: 'id', description: 'Dish ID' })
  @ApiResponse({ status: 204, description: 'Dish has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Dish not found.' })
  async deleteDish(@Param('id', ParseIntPipe) id: number) {
    await this.dishService.deleteDish(BigInt(id));
  }
}
