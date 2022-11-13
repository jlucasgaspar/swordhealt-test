import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthControllerGuard } from '@/shared/guards/jwt-auth-controller.guard';
import { GetRequestUser } from '@/shared/decorators/get-request-user.decorator';
import { RoleACLGuard } from '@/shared/guards/role-acl.guard';
import { SwaggerDocs } from '@/shared/decorators/swagger.decorator';
import { IUserController } from './dto/user-controller.dto';
import { UserService } from './user.service';
import { IUser } from './dto/user.dto';

const AuthGuard = JWTAuthControllerGuard({
  publicRoutes: ['getToken'],
});

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(RoleACLGuard('manager:true', 'technician:false'))
  @SwaggerDocs({
    response: IUserController.GetAllResponse,
    hasBearerToken: true,
    tag: 'manager',
  })
  async getAll(): Promise<IUserController.GetAllResponse> {
    return await this.userService.getAllUsers();
  }

  @Post()
  @UseGuards(RoleACLGuard('manager:true', 'technician:false'))
  @SwaggerDocs({
    response: IUserController.CreateResponse,
    hasBearerToken: true,
    tag: 'manager',
  })
  async createUser(
    @Body() body: IUserController.CreateDTO,
  ): Promise<IUserController.CreateResponse> {
    return this.userService.createUser(body);
  }

  @Put(':userId')
  @UseGuards(RoleACLGuard('manager:true', 'technician:id:param'))
  @SwaggerDocs({
    response: IUserController.UpdateResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async updateUser(
    @Param('userId') userId: number,
    @Body() body: IUserController.UpdateDTO,
  ): Promise<IUserController.UpdateResponse> {
    return this.userService.updateUser(userId, body);
  }

  @Delete(':userId')
  @UseGuards(RoleACLGuard('manager:true', 'technician:false'))
  @SwaggerDocs({
    response: IUserController.DeleteResponse,
    hasBearerToken: true,
    tag: 'manager',
  })
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<IUserController.DeleteResponse> {
    return this.userService.softDeleteUser(Number(userId));
  }

  @Post('getToken')
  @SwaggerDocs({
    response: IUserController.GetTokenResponse,
    tag: 'public',
  })
  async getToken(
    @Body() body: IUserController.GetTokenDTO,
  ): Promise<IUserController.GetTokenResponse> {
    return this.userService.getToken(body);
  }

  @Get('me')
  @SwaggerDocs({
    response: IUserController.GetMeResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async getMe(@GetRequestUser() user: IUser) {
    return { user };
  }
}
