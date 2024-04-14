import { Module } from '@nestjs/common';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { myRoles, Roles } from './roles.decorators';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userModel } from 'src/user/schemas/user.schema';

@Module({
  controllers: [],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: userModel }]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('secret.JWTsecretKey'),
        signOptions: { expiresIn: '60s' },
      }),
    }),
  ],
  providers: [AuthenticationGuard, AuthorizationGuard],
  exports: [AuthenticationGuard, AuthorizationGuard],
})
export class SharedModule {}
