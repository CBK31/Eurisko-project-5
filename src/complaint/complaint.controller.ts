import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ComplaintService } from './complaint.service';
import {
  CreateComplaintDto,
  UpdateStatusDto,
} from './dto/create-complaint.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { GetUser } from 'src/shared/decorators/getUser.decorators';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { Roles } from 'src/shared/decorators/roles.decorators';

@Controller('complaint')
export class ComplaintController {
  constructor(private readonly complaintService: ComplaintService) {}

  @UseGuards(AuthenticationGuard)
  @Post('create')
  async createComplaint(
    @Body() createComplaintDto: CreateComplaintDto,
    @GetUser() userId: string,
  ) {
    return await this.complaintService.create(createComplaintDto, userId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('mycomplaintspaginated')
  async getMyComplaints(
    @GetUser() userId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return await this.complaintService.getUserComplaints(userId, +page, +limit);
  }

  @UseGuards(AuthenticationGuard)
  @Get('getmycomplaint/:id')
  async getMyComplaintDetails(
    @GetUser() userId: string,
    @Param('id') complaintId: string,
  ) {
    return await this.complaintService.getMyComplaintDetails(
      userId,
      complaintId,
    );
  }

  @UseGuards(AuthenticationGuard)
  @Delete('deletemycomplaint/:id')
  async deleteMyComplaint(
    @GetUser() userId: string,
    @Param('id') complaintId: string,
  ) {
    return await this.complaintService.deleteMyComplaint(userId, complaintId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('mycomplaintsbystatus')
  async getMyComplaintsByStatus(@GetUser() userId: string) {
    return await this.complaintService.getUserComplaintsByStatus(userId);
  }

  // Get all clients' complaints with optional filters by status and user.
  // paginated and sorted by creation date
  // naming that API is harder then creating it
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin'])
  @Get('allcomplaints')
  async getAllComplaints(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('status') status: string,
    @Query('id') userId: string,
  ) {
    return await this.complaintService.getAllComplaints(
      +page,
      +limit,
      userId,
      status,
    );
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin'])
  @Patch('updatestatus/:id')
  async updateCategoryStatus(
    @Body() updateStatusDto: UpdateStatusDto,
    @Param('id') complaintId: string,
  ) {
    return await this.complaintService.updateCategoryStatus(
      updateStatusDto,
      complaintId,
    );
  }
}
