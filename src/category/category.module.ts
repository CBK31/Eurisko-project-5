import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userModel } from 'src/user/schemas/user.schema';
import { Category, CategoryModel } from './schemas/category.schema';
import { SharedModule } from 'src/shared/shared.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategoryModel }]),
    ConfigModule,
    SharedModule,
    JwtModule,
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
