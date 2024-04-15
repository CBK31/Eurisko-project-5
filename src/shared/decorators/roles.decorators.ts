import { SetMetadata } from '@nestjs/common';

export const myRoles = 'roles';
export const Roles = (roles: String[]) => SetMetadata(myRoles, roles);
