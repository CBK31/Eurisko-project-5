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
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @UseGuards(AuthenticationGuard, AuthorizationGuard)
  // @Roles(['admin', 'employee'])
  // @Patch(':id/activate')
  // async updateActivationStatus(
  //   @Param('id') id: string,
  //   @Body() activateUserDto: ActivateUserDto,
  // ) {
  //   return this.userService.updateActivationStatus(
  //     id,
  //     activateUserDto.isActivated,
  //   );
  // }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Patch(':id/paginated')
  async GetCategoryPaginated(@Param('id') id: string) {
    return this.categoryService.getCategoryPaginated(id);
  }
}
