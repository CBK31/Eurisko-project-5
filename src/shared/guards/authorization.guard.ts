import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { myRoles } from '../roles.decorators';
import { unAuthorizedException } from '../exceptions/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requestInfo = context.switchToHttp().getRequest();
      const userId = requestInfo.user.id;

      const userRoleObject = await this.userModel.findById(userId, 'role -_id');
      const userRole = userRoleObject.role;
      // replacing that code : (for faster querying)
      // const user = await this.userModel.findById(userId);
      //const userRole = user.role;

      console.log('user id from token : ' + userId);

      console.log('user ROLE from database : ' + userRoleObject.role);
      const requiredRoles = this.reflector.getAllAndOverride(myRoles, [
        context.getClass(),

        context.getHandler(),
      ]);
      console.log('required Roles from controller : ' + requiredRoles);

      if (!requiredRoles) {
        return true;
      }

      if (!userRole || !requiredRoles.includes(userRole)) {
        throw new unAuthorizedException();
      }

      return true;
    } catch (error) {
      throw new unAuthorizedException();
    }
  }
}
