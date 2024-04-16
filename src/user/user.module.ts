import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { User, userModel } from './schemas/user.schema';
import { SharedModule } from 'src/shared/shared.module';
import { RefreshToken, RefreshTokenModel } from './schemas/refreshToken.schema';
import { OtpModule } from 'src/otp/otp.module';

// bedde jarrib chil kel chi mech daroure a3mello inport la2anno ma3mello export mnel shared module
// meteel bel category
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
    MongooseModule.forFeature([
      { name: RefreshToken.name, schema: RefreshTokenModel },
    ]),
    ConfigModule,
    SharedModule,
    OtpModule,
    //  JwtModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret.JWTsecretKey'),
        signOptions: { expiresIn: '300s' },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [],
})
export class UserModule {}
