import { IsString, IsNumber, IsArray, IsOptional, Min, IsBoolean, IsDateString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateDishDto {
  @ApiProperty({
    description: 'The ID of the cook who created the dish',
    example: 1
  })
  @IsNumber()
  cookId!: number;

  @ApiProperty({
    description: 'Name of the dish',
    example: 'Spaghetti Carbonara'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Detailed description of the dish',
    example: 'Traditional Italian pasta dish made with eggs, cheese, pancetta, and black pepper',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Price of the dish in the smallest currency unit (e.g., cents)',
    minimum: 0,
    example: 1500
  })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({
    description: 'Preparation time in minutes',
    minimum: 0,
    example: 30
  })
  @IsNumber()
  @Min(0)
  preparationTime!: number;

  @ApiProperty({
    description: 'Array of category IDs this dish belongs to',
    type: [Number],
    example: [1, 2]
  })
  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds!: number[];

  @ApiProperty({
    description: 'Array of image URLs',
    type: [String],
    required: false,
    example: ['https://example.com/image1.jpg']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({
    description: 'Whether the dish is currently available',
    default: true,
    required: false
  })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({
    description: 'Date and time when the dish becomes available',
    example: '2023-12-31T23:59:59Z',
    required: false
  })
  @IsDateString()
  @IsOptional()
  availableFrom?: string;

  @ApiProperty({
    description: 'Date and time until the dish is available',
    example: '2024-01-31T23:59:59Z',
    required: false
  })
  @IsDateString()
  @IsOptional()
  availableUntil?: string;

  @ApiProperty({
    description: 'Maximum number of dishes that can be prepared per day',
    minimum: 0,
    example: 50,
    required: false
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxDailyQuantity?: number;

  @ApiProperty({
    description: 'Status of the dish',
    enum: ['ACTIVE', 'INACTIVE'],
    example: 'ACTIVE',
    required: false
  })
  @IsString()
  @IsOptional()
  status?: 'ACTIVE' | 'INACTIVE';
}

// PartialType makes all properties optional
export class UpdateDishDto extends PartialType(CreateDishDto) {}
