import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDataService } from './services/user-data.service';
import { UserDataController } from './controllers/user-data.controller';
import { UserInteractionService } from './services/user-interaction.service';
import { UserInteractionController } from './controllers/user-interaction.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ UserDataController, UserInteractionController],
  providers: [ PrismaService, UserDataService, UserInteractionService],
  exports: [ UserDataService, UserInteractionService],
})
export class UsersModule {}
