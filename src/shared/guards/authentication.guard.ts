import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { unAuthenticateException } from '../exceptions/exceptions';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requestInfo = context.switchToHttp().getRequest();
      const token = requestInfo.headers.authorization.split(' ')[1];

      if (!token) {
        throw new unAuthenticateException();
      } else {
        requestInfo.user = this.jwtService.verify(token);
      }
    } catch (error) {
      throw new unAuthenticateException();
    }
    return true;
  }
}
