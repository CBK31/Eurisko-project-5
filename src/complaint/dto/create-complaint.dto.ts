import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  complaintBody: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categorys: string[];

  @IsEnum(['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'])
  status: string;
}
