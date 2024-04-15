import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    private configService: ConfigService,
  ) {}
}
