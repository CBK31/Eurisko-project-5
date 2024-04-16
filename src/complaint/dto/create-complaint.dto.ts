import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
} from 'class-validator';
//   @IsNotEmpty()
//   @IsMongoId()
//   userId: string;

//   @IsEnum(['PENDING', 'INPROGRESS', 'RESOLVED', 'REJECTED'])
//   status: string;

export class CreateComplaintDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsMongoId({ each: true })
  categorys: string[];
}
