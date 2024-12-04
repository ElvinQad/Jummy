import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new category',
    description: 'Creates a new dish category with optional image and description. Categories can have parent-child relationships.'
  })
  @ApiResponse({ status: 201, description: 'Category has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid category data provided.' })
  @ApiResponse({ status: 409, description: 'Category with the same slug already exists.' })
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.createCategory(createCategoryDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all categories',
    description: 'Retrieves all categories with their images, descriptions, and timestamps. Can include or exclude subcategories in the response.'
  })
  @ApiQuery({ 
    name: 'includeSubcategories', 
    required: false, 
    type: Boolean,
    description: 'Whether to include subcategories in the response'
  })
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully.' })
  async getCategories(@Query('includeSubcategories') includeSubcategories?: boolean) {
    return this.categoryService.getCategories(includeSubcategories);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get category by ID',
    description: 'Retrieves detailed information about a specific category.'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category details retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategoryById(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update category',
    description: 'Updates an existing category with the provided details.'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Category with the same slug already exists.' })
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Delete category',
    description: 'Removes a category. Cannot delete categories that have subcategories.'
  })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Category has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 409, description: 'Cannot delete category with subcategories.' })
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.deleteCategory(id);
  }
}
