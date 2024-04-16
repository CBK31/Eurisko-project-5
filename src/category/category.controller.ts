import { Roles } from 'src/shared/decorators/roles.decorators';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { CategoryService } from './category.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { GetUser } from 'src/shared/decorators/getUser.decorators';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // ------------------------------------------------------------------------------

  //

  //-------------------------------------------------------------------------------

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Post('create')
  async addCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() userId: string,
  ) {
    return this.categoryService.addCategory(createCategoryDto, userId);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Patch('update/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() userId: string,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto, userId);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Delete('delete/:id')
  async deleteCategory(@Param('id') id: string, @GetUser() userId: string) {
    return this.categoryService.deleteCategory(id, userId);
  }

  //Get a list of complaint categories added by an admin
  // i done it with pagination , i think its more logic
  @Get('paginated/:id')
  async GetCategoryPaginatedOfAnAdmin(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.GetCategoryPaginatedOfAnAdmin(id, page, limit);
  }

  //Get my complaints category paginated
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Get('mycomplaintspaginated')
  async GetMyComplaintsPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @GetUser() userId: string,
  ) {
    return this.categoryService.GetMyComplaintsPaginated(userId, page, limit);
  }

  //Get my complaint category by category id
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Get('/complaint/:id')
  async getComplaintDetails(
    @Param('id') id: string,
    @GetUser() userId: string,
  ) {
    return this.categoryService.getComplaintDetailsById(id, userId);
  }
}