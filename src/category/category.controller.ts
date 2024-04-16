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

  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(['admin', 'employee'])
  @Get(':id/paginated')
  async GetCategoryPaginated(
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Param('id') id: string,
  ) {
    return this.categoryService.getCategoryPaginated(id, page, limit);
  }

  // ------------------------------------------------------------------------------

  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(['admin', 'employee'])
  @Post()
  async addCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @GetUser() userId: string,
  ) {
    return this.categoryService.addCategory(createCategoryDto, userId);
  }

  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(['admin', 'employee'])
  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @GetUser() userId: string,
  ) {
    return this.categoryService.updateCategory(id, updateCategoryDto, userId);
  }

  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(['admin', 'employee'])
  @Delete(':id')
  async deleteCategory(@Param('id') id: string, @GetUser() userId: string) {
    return this.categoryService.deleteCategory(id, userId);
  }
}
