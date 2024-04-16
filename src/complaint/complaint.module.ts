import { Module } from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import { ComplaintController } from './complaint.controller';
import { SharedModule } from 'src/shared/shared.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Complaint, ComplaintModel } from './schemas/complaint.schema';
import { User, userModel } from 'src/user/schemas/user.schema';
import { Category, CategoryModel } from 'src/category/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Complaint.name, schema: ComplaintModel },
    ]),
    MongooseModule.forFeature([{ name: Category.name, schema: CategoryModel }]),
    MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
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
