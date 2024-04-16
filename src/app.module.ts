import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SharedModule } from './shared/shared.module';
import { OtpModule } from './otp/otp.module';
import { CategoryModule } from './category/category.module';
import { ComplaintModule } from './complaint/complaint.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.connectionString'),
      }),
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [config],
    }),
    SharedModule,
    OtpModule,
    CategoryModule,
    ComplaintModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
