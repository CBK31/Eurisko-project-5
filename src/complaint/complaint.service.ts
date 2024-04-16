import { Injectable } from '@nestjs/common';
import { CreateComplaintDto } from './dto/create-complaint.dto';
import { UpdateComplaintDto } from './dto/update-complaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint } from './schemas/complaint.schema';
import { Category } from 'src/category/schemas/category.schema';
import { CategoryNotFoundException } from './exceptions/complaint.exceptions';

@Injectable()
export class ComplaintService {
  constructor(
    @InjectModel(Complaint.name) private ComplaintModel: Model<Complaint>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  async create(
    createComplaintDto: CreateComplaintDto,
    userId: string,
  ): Promise<object> {
    const complaintCount = await this.ComplaintModel.countDocuments();
    const modifiedTitle = `${createComplaintDto.title}#${complaintCount + 1}`;
    const { description, categories } = createComplaintDto;

    for (const categoryId of categories) {
      const category = await this.CategoryModel.findById(categoryId).exec();
      if (!category) {
        throw new CategoryNotFoundException(categoryId);
      }
    }

    const newComplaint = new this.ComplaintModel({
      createdBy: userId,
      title: modifiedTitle,
      description,
      categories,
    });

    const complaintCreated = await newComplaint.save();
    return {
      message: 'Complaint created successfully',
      complaint: {
        id: `${complaintCreated['_id']}`,
        titel: modifiedTitle,
      },
    };
  }
}
