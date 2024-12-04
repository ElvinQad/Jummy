import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { type ChefApplication, ApplicationStatus } from '@prisma/client';
import { CreateChefApplicationDto, UpdateApplicationStatusDto } from '../dto/chef-application.dto';

@Injectable()
export class ChefApplicationService {
  private readonly logger = new Logger(ChefApplicationService.name);

  constructor(private prisma: PrismaService) {}

  async create(
    userId: number, 
    dto: CreateChefApplicationDto,
    files: { 
      certificateFiles?: Express.Multer.File[], // Use Multer File type
      documentFiles?: Express.Multer.File[]
    }
  ): Promise<ChefApplication> {
    this.logger.debug(`Attempting to create application for user ${userId} with data: ${JSON.stringify(dto)}`);
    
    try {
      // Check for existing application
      const existingApplication = await this.prisma.chefApplication.findUnique({
        where: { userId },
      });

      if (existingApplication) {
        this.logger.warn(`User ${userId} already has an application`);
        throw new BadRequestException('Application already exists for this user');
      }

      // Validate category IDs
      this.logger.debug(`Validating categories: main=${dto.mainCategoryIds}, sub=${dto.subCategoryIds}`);
      
      if (dto.mainCategoryIds.length === 0) {
        throw new BadRequestException('At least one main category is required');
      }

      const categories = await this.prisma.category.findMany({
        where: {
          id: {
            in: [...dto.mainCategoryIds, ...dto.subCategoryIds]
          }
        }
      });

      const foundIds = categories.map(cat => cat.id);
      const allRequestedIds = [...dto.mainCategoryIds, ...dto.subCategoryIds];
      const missingIds = allRequestedIds.filter(id => !foundIds.includes(id));
      
      if (missingIds.length > 0) {
        this.logger.warn(`Invalid category IDs found: ${missingIds.join(', ')}`);
        throw new BadRequestException(`Invalid category IDs: ${missingIds.join(', ')}`);
      }

      // Process files
      const certificateFileData = files.certificateFiles?.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      })) || [];

      const documentFileData = files.documentFiles?.map(file => ({
        filename: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      })) || [];

      // Create application with processed files
      this.logger.debug('Creating chef application...');
      const application = await this.prisma.chefApplication.create({
        data: {
          userId,
          businessName: dto.businessName,
          description: dto.description,
          certificateFiles: certificateFileData,
          documentFiles: documentFileData,
          status: ApplicationStatus.PENDING,
          mainCategories: {
            connect: dto.mainCategoryIds.map(id => ({ id })),
          },
          subCategories: {
            connect: dto.subCategoryIds.map(id => ({ id })),
          },
        },
        include: {
          mainCategories: true,
          subCategories: true,
        },
      });

      this.logger.log(`Successfully created chef application #${application.id} for user ${userId}`);
      return application;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      this.logger.error(`Failed to create chef application: ${(error as any).message}`, (error as any).stack);
      if ((error as any).code === 'P2002') {
        throw new BadRequestException('Application already exists for this user');
      }
      if ((error as any).code === 'P2025') {
        throw new BadRequestException('Invalid category IDs or user ID');
      }
      throw new BadRequestException('Failed to create chef application. Please try again.');
    }
  }

  async findAll() {
    return this.prisma.chefApplication.findMany({
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        mainCategories: true,
        subCategories: true,
      },
    });
  }

  async findOne(id: number) {
    const application = await this.prisma.chefApplication.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        mainCategories: true,
        subCategories: true,
      },
    });

    if (!application) {
      throw new NotFoundException(`Application #${id} not found`);
    }

    return application;
  }

  async updateStatus(id: number, dto: UpdateApplicationStatusDto) {
    try {
      const application = await this.prisma.chefApplication.findUnique({
        where: { id },
        include: { user: true },
      });

      if (!application) {
        throw new NotFoundException(`Application #${id} not found`);
      }

      if (application.status === ApplicationStatus.APPROVED) {
        throw new BadRequestException('Application is already approved');
      }

      const updated = await this.prisma.$transaction(async (prisma) => {
        const updatedApplication = await prisma.chefApplication.update({
          where: { id },
          data: {
            status: dto.status,
            reviewNotes: dto.reviewNotes,
            reviewedAt: new Date(),
          },
        });

        if (dto.status === ApplicationStatus.APPROVED) {
          await prisma.user.update({
            where: { id: application.userId },
            data: { isChef: true },
          });
        }

        return updatedApplication;
      });

      this.logger.log(`Updated application ${id} status to ${dto.status}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update application status: ${(error as any).message}`);
      throw error;
    }
  }
}