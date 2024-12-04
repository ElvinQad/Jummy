import { Module } from '@nestjs/common';
import { DishService } from './dish.service';
import { DishController } from './dish.controller';
import { CategoryService } from './category/category.service';
import { PrismaService } from '../prisma/prisma.service';
import { CategoryController } from './category/category.controller';
import { FoodTypeController } from './type/food-type.controller';
import { FoodTypeService } from './type/food-type.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [DishService, CategoryService, FoodTypeService, PrismaService],
  controllers: [DishController, CategoryController, FoodTypeController],
  exports: [DishService],
})
export class DishModule {}
