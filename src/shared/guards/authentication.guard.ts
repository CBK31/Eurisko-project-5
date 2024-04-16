import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { unAuthenticateException } from '../exceptions/exceptions';
import { JwtService } from '@nestjs/jwt/dist';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requestInfo = context.switchToHttp().getRequest();
      const token = requestInfo.headers.authorization.split(' ')[1];

      if (!token) {
        throw new unAuthenticateException();
      } else {
        //
        requestInfo.user = this.jwtService.verify(token);
        const userFinder = await this.userModel.findById(requestInfo.user.id);
        if (!userFinder || !userFinder['isActivated']) {
          throw new unAuthenticateException();
        }
      }
    } catch (error) {
      throw new unAuthenticateException();
    }
    return true;
  }
}
