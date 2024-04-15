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

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin'])
  @Post('signupcmsuser')
  @HttpCode(HttpStatus.CREATED)
  async createCmsUser(@Body() createCmsUserDto: CreateCmsUserDto) {
    return await this.userService.createCmsUser(createCmsUserDto);
  }

  @Post('login')
  async signIn(@Body() loginUserDto: LoginUserDto) {
    return await this.userService.logIn(loginUserDto);
  }

  @Post('forgetpassword')
  async forgetPassword(@Body() userEmailDto: UserEmailDto) {
    return await this.userService.forgetPassword(userEmailDto);
  }

  @UseGuards(AuthenticationGuard)
  @Post('changepassword')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.changePassword(changePasswordDto, userId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('resetpassword')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @GetUser() userId: string,
  ) {
    return await this.userService.resetPassword(resetPasswordDto, userId);
  }

  @Get('getaccesstoken')
  async getaccessToken(
    @Body() getAccessTokenDto: GetAccessTokenDto,
    @Param('id') id: string,
  ) {
    return await this.userService.getaccesstoken(id, getAccessTokenDto);
  }

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

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin'])
  @Patch(':id/toadmin')
  async CmsRoleToAdmin(@Param('id') id: string) {
    return this.userService.CmsRoleToAdmin(id);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Get('mycmsdetails')
  async GetMyCmsDetails(@GetUser() userId: string) {
    return await this.userService.GetMyCmsDetails(userId);
  }

  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Roles(['admin', 'employee'])
  @Get('allcmsdetails')
  async GetAllCmsDetails(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return await this.userService.GetAllCmsDetails(+page, +limit);
  }
}
