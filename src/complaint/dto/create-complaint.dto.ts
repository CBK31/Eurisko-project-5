import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
  IsEnum,
} from 'class-validator';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @IsMongoId({ each: true })
  categories: string[];
}

// enum status {
//   Admin = 'admin',
//   Employee = 'employee',
//   Client = 'client',
// }

enum status {
  PENDING = 'PENDING',
  INPROGRESS = 'INPROGRESS',
  RESOLVED = 'RESOLVED',
  REJECTED = 'REJECTED',
}

export class UpdateStatusDto {
  @IsEnum(status)
  Status: string;
}
