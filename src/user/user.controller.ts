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
  ActivateUserDto,
  ChangePasswordDto,
  CreateCmsUserDto,
  CreateUserDto,
  GetAccessTokenDto,
  LoginUserDto,
  ResetPasswordDto,
  UserEmailDto,
} from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { AuthorizationGuard } from 'src/shared/guards/authorization.guard';
import { Roles } from 'src/shared/decorators/roles.decorators';
import { GetUser } from 'src/shared/decorators/getUser.decorators';

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

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin'])
  @Post('signupcmsuser')
  @HttpCode(HttpStatus.CREATED)
  async createCms(@Body() createCmsUserDto: CreateCmsUserDto) {
    return await this.userService.createCmsUser(createCmsUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.logIn(loginUserDto);
  }

  @Post('forgetpassword')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() userEmailDto: UserEmailDto) {
    return await this.userService.forgetPassword(userEmailDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('changepassword')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.changePassword(changePasswordDto, userId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('resetpassword')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.resetPassword(resetPasswordDto, userId);
  }

  @Get('getaccesstoken')
  @HttpCode(HttpStatus.OK)
  async getaccessToken(@Body() getAccessTokenDto: GetAccessTokenDto) {
    return await this.userService.getaccesstoken(getAccessTokenDto);
  }

  // @Post('activateuser')
  // async activateUser(@Body() activateUserDto: ActivateUserDto) {
  //   return await this.userService.activateUser(activateUserDto);
  // }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Patch(':id/activate')
  async updateActivationStatus(
    @Param('id') id: string,
    @Body() activateUserDto: ActivateUserDto,
  ) {
    return this.userService.updateActivationStatus(
      id,
      activateUserDto.isActivated,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
