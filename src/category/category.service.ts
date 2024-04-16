import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';
import { Category } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryNotFoundException } from './exceptions/category.exceptions';
import { Roles } from 'src/shared/decorators/roles.decorators';
@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
    private configService: ConfigService,
  ) {}

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
    newCategory.save();

    return {
      message: 'category created successfully',
      category: {
        Name: name,
        Description: description,
        createdBy: createdBy,
      },
    };
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    userId: string,
  ): Promise<object> {
    const updatedCategory = await this.CategoryModel.findByIdAndUpdate(
      id,
      { ...updateCategoryDto, createdBy: userId },
      { new: true },
    );
    if (!updatedCategory) {
      throw new CategoryNotFoundException(id);
    }
    const { name, description, createdBy } = updatedCategory;
    return {
      message: 'category updated successfully',
      category: {
        Name: name,
        Description: description,
        createdBy: createdBy,
      },
    };
  }

  async deleteCategory(id: string, userId: string): Promise<object> {
    const result = await this.CategoryModel.deleteOne({
      _id: id,
      createdBy: userId,
    }).exec();
    if (result.deletedCount === 0) {
      throw new CategoryNotFoundException(id);
    }

    return {
      message: 'category deleted successfully',
      category: {
        CategoryId: id,
      },
    };
  }

  async GetCategoryPaginatedOfAnAdmin(id, page, limit) {
    return await this.getComplaintPaginatedByUserId(id, page, limit);
  }

  async GetMyComplaintsPaginated(id, page, limit) {
    return await this.getComplaintPaginatedByUserId(id, page, limit);
  }

  async getComplaintPaginatedByUserId(id, page, limit) {
    const skip = (page - 1) * limit;

    const data = await this.CategoryModel.find({
      createdBy: id,
    })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = Object.keys(data).length;

    return { data, total, page, limit };
  }

  async getComplaintDetailsById(
    complaintId: string,
    userId: string,
  ): Promise<object> {
    const complaint = await this.CategoryModel.findOne({
      _id: complaintId,
      createdBy: userId,
    }).exec();
    if (!complaint) {
      throw new CategoryNotFoundException(complaintId);
    }
    return complaint;
  }
}
