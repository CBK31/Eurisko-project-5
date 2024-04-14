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
} from '@nestjs/common';
import { UserService } from './user.service';
import { activateUserDto, CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { Roles } from 'src/shared/roles.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post('create')
  @Roles(['admin', 'client'])
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const userCreated = await this.userService.create(createUserDto);

    return {
      message: 'User created successfully',
      user: { id: `${userCreated['_id']}`, email: `${userCreated['email']}` },
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // from chatGPT to update my isActivate user
  @Patch(':id/activate')
  async updateActivationStatus(
    @Param('id') id: string,
    @Body() isActivatedDTO: activateUserDto,
  ) {
    // Use the service to update the activation status
    // For example:
    // return this.userService.updateActivationStatus(id, isActivatedDTO.isActivated);
  }
  // --------------- 5alsit taba3 el isActivate -------------------------

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
