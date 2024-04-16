import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    private configService: ConfigService,
  ) {}

  async getCategoryPaginated(id, page, limit) {
    const skip = (page - 1) * limit;

    const data = await this.CategoryModel.find({
      role: { $in: ['admin', 'employee'] },
    })
      .find({ createdBy: id })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = Object.keys(data).length;

    return { data, total, page, limit };
  }

  async addCategory(
    createCategoryDto: CreateCategoryDto,
    createdBy: string,
  ): Promise<object> {
    const { name, description } = createCategoryDto;
    const newCategory = new this.CategoryModel({
      name,
      description,
      createdBy,
    });
    await newCategory.save();

    return {
      message: 'category created successfully',
      user: {
        categoryName: name,
      },
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<Category> {
    const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
      id,
      { ...updateCategoryDto, createdBy: userId },
      { new: true },
    );
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return updatedCategory;
  }

  async deleteCategory(id: string, userId: string): Promise<void> {
    const result = await this.CategoryModel.deleteOne({
      _id: id,
      createdBy: userId,
    }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(
        `Category with ID "${id}" not found or you're not the owner`,
      );
    }
  }
}
