import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseGuards,
  ParseIntPipe,
  HttpStatus,
  Logger,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ChefApplicationService } from './chef-application.service';
import {
  CreateChefApplicationDto,
  UpdateApplicationStatusDto,
} from '../dto/chef-application.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../../auth/guards/admin.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: any; // Replace 'any' with the actual user type if available
}

@ApiTags('Chef Applications')
@Controller('chef-applications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChefApplicationController {
  private readonly logger = new Logger(ChefApplicationController.name);

  constructor(
    private readonly chefApplicationService: ChefApplicationService,
  ) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'certificateFiles', maxCount: 10 },
      { name: 'documentFiles', maxCount: 10 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new chef application' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Application created successfully',
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateChefApplicationDto,
    @UploadedFiles()
    files: {
      certificateFiles?: Express.Multer.File[]; // Use Multer File type
      documentFiles?: Express.Multer.File[];
    },
  ) {
    const userId = req.user.userId || req.user.sub;
    if (!userId) {
      throw new BadRequestException('Invalid user authentication');
    }
    this.logger.debug(`Received application request from user ${userId}`);

    try {
      const result = await this.chefApplicationService.create(
        userId,
        dto,
        files,
      );
      return result;
    } catch (error) {
      this.logger.error(
        `Application creation failed for user ${userId}: ${(error as any).message}`,
      );
      throw error;
    }
  }

  @Get()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all chef applications' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all applications',
  })
  findAll() {
    return this.chefApplicationService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific chef application' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the application',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Application not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.chefApplicationService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update application status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid status',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.chefApplicationService.updateStatus(id, dto);
  }
}
