import { Injectable } from '@nestjs/common';
import {
  CreateComplaintDto,
  UpdateStatusDto,
} from './dto/create-complaint.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Complaint } from './schemas/complaint.schema';
import { Category } from 'src/category/schemas/category.schema';
import {
  CategoryNotFoundException,
  complaintNotFoundException,
  notStatusSpecifiedException,
} from './exceptions/complaint.exceptions';

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

  async getUserComplaints(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<object> {
    const skip = (page - 1) * limit;
    const complaints = await this.ComplaintModel.find({ createdBy: userId })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await this.ComplaintModel.countDocuments({
      createdBy: userId,
    });

    return {
      data: complaints,
      total,
      page,
      limit,
    };
  }

  async getMyComplaintDetails(userId, complaintId): Promise<object> {
    return await this.ComplaintModel.find({
      _id: complaintId,
      createdBy: userId,
    });
  }

  async deleteMyComplaint(userId, complaintId): Promise<object> {
    const deletedComplaint = await this.ComplaintModel.deleteOne({
      _id: complaintId,
      createdBy: userId,
    });
    if (deletedComplaint['deletedCount'] != 0) {
      return {
        message: 'Complaint deleted successfully',
        deletedCount: deletedComplaint['deletedCount'],
      };
    }
    throw new complaintNotFoundException(complaintId);
  }

  async getUserComplaintsByStatus(userId: string): Promise<object> {
    const pipeline = [
      { $match: { createdBy: userId } },
      {
        $group: {
          _id: '$status',
          complaintIds: { $addToSet: '$_id' },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          complaintIds: 1,
        },
      },
    ];

    const result = await this.ComplaintModel.aggregate(pipeline).exec();

    return {
      data: result,
    };
  }

  async getAllComplaints(
    page: number = 1,
    limit: number = 10,
    userId?: string,
    status?: string,
  ): Promise<object> {
    const query = {};
    if (userId) {
      query['createdBy'] = userId;
    }
    if (status) {
      query['status'] = status;
    }

    const complaints = await this.ComplaintModel.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await this.ComplaintModel.countDocuments(query);

    return {
      data: complaints,
      total,
      page,
      limit,
    };
  }

  async updateCategoryStatus(
    updateStatusDto: UpdateStatusDto,
    complaintId,
  ): Promise<object> {
    const { Status } = updateStatusDto;
    console.log('complaint id : ' + complaintId);
    const updatedComplaint = await this.ComplaintModel.findByIdAndUpdate(
      complaintId,
      { status: Status },
      { new: true },
    );
    if (!updatedComplaint) {
      throw new complaintNotFoundException(complaintId);
    }
    return {
      message: `Complaint status updated successfully to ${Status}`,
    };
  }
}
