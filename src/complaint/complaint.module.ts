import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Category, CategoryModel } from 'src/category/schemas/category.schema';

@Module({
  imports: [
    //  MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategoryModel }]),
    ConfigModule,
    SharedModule,
    // JwtModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret.JWTsecretKey'),
        signOptions: { expiresIn: '300s' },
      }),
    }),
  ],
  controllers: [ComplaintController],
  providers: [ComplaintService],
})
export class ComplaintModule {}
