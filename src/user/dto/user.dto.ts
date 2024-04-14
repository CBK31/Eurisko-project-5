import {
  IsBoolean,
  IsEmail,
  IsEnum,
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
  @IsNumber()
  id: string;
}
export class activateUserDto extends userIdDto {
  @IsBoolean()
  isActivated: boolean;
}
