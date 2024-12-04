import { IsString, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Name of the category',
    example: 'Italian Cuisine'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'URL-friendly version of the category name',
    example: 'italian-cuisine'
  })
  @IsString()
  slug!: string;

  @ApiProperty({
    description: 'ID of the parent category (for nested categories)',
    example: 1,
    required: false
  })
  @IsNumber()
  @IsOptional()
  parentId?: number;

  @ApiProperty({
    description: 'URL to category image',
    example: 'https://example.com/images/italian-cuisine.jpg',
    required: false
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Detailed description of the category',
    example: 'Traditional Italian dishes and recipes',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateCategoryDto {
  @ApiProperty({
    description: 'Updated name of the category',
    example: 'Italian Dishes',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Updated URL-friendly version of the category name',
    example: 'italian-dishes',
    required: false
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    description: 'URL to category image',
    example: 'https://example.com/images/italian-cuisine.jpg',
    required: false
  })
  @IsUrl()
  @IsOptional()
  image?: string;

  @ApiProperty({
    description: 'Detailed description of the category',
    example: 'Traditional Italian dishes and recipes',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;
}
