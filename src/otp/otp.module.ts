import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OTP, OTPModel } from './schema/otp.schema';
import { User, userModel } from 'src/user/schemas/user.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPModel }]),
    MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
