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
import {
  activateUserDto,
  CreateUserDto,
  LoginUserDto,
  ResetPasswordDto,
  UserEmailDto,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { Roles } from 'src/shared/roles.decorators';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //@UseGuards(AuthenticationGuard, AuthorizationGuard)
  //@Roles(['admin', 'client'])

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.logIn(loginUserDto);
  }

  @Post('forgetpassword')
  @HttpCode(HttpStatus.OK)
  async forgetpassword(@Body() userEmailDto: UserEmailDto) {
    return await this.userService.forgetPassword(userEmailDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('resetpassword')
  @HttpCode(HttpStatus.OK)
  async resetpassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.userService.resetpassword(resetPasswordDto);
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
