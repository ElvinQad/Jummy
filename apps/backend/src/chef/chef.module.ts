import { Module } from '@nestjs/common';
import { ChefController } from './chef.controller';
import { ChefService } from './chef.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ChefApplicationController } from './apply/chef-application.controller';
import { ChefApplicationService } from './apply/chef-application.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ChefController, ChefApplicationController],
  providers: [ChefService, ChefApplicationService],
  exports: [ChefService],
})
export class ChefModule {}
