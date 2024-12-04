import { IsString, IsArray, IsOptional, IsEnum, MinLength, MaxLength, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface FileData {
  filename: string;
  path: string;
  mimetype: string;
}

export class FileDto implements FileData {
  @IsString()
  @ApiProperty()
  filename!: string;

  @IsString()
  @ApiProperty()
  path!: string;

  @IsString()
  @ApiProperty()
  mimetype!: string;
}

export class CreateChefApplicationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  @ApiProperty()
  businessName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(1000)
  @ApiProperty()
  description!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number], description: 'Array of main category IDs' })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  mainCategoryIds!: number[];

  @IsArray()
  @ArrayMinSize(1)
  @ApiProperty({ type: [Number], description: 'Array of subcategory IDs' })
  @Transform(({ value }) => {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  })
  subCategoryIds!: number[];
}

export class UpdateApplicationStatusDto {
  @IsEnum(ApplicationStatus)
  @ApiProperty({ enum: ApplicationStatus })
  status!: ApplicationStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @ApiProperty({ required: false })
  reviewNotes?: string;
}