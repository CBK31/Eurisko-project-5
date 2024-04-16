import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class UserEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class LoginUserDto extends UserEmailDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;
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

export class ActivateUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isActivated: boolean;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  confirmPassword: string;
}

export class GetAccessTokenDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
