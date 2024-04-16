import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsArray,
  ArrayNotEmpty,
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
