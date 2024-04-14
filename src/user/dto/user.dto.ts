import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateUserDto extends LoginUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}

enum UserRole {
  Admin = 'admin',
  Employee = 'employee',
  Client = 'client',
}

export class CreateCmsUserDto extends CreateUserDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class userIdDto {
  @IsNotEmpty()
  @IsString()
  id: string;
}
export class activateUserDto extends userIdDto {
  @IsBoolean()
  isActivated: boolean;
}
