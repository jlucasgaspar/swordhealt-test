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
import { OnlyManagerGuard } from '@/shared/guards/manager.guard';
import { SwaggerDocs } from '@/shared/decorators/swagger.decorator';
import { IUserController } from './dto/user-controller.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(OnlyManagerGuard)
  @SwaggerDocs({
    response: IUserController.GetAllResponse,
    hasBearerToken: true,
  })
  async getAll(): Promise<IUserController.GetAllResponse> {
    return await this.userService.getAllUsers();
  }

  @Post()
  @UseGuards(OnlyManagerGuard)
  @SwaggerDocs({
    response: IUserController.CreateResponse,
    hasBearerToken: true,
  })
  async createUser(
    @Body() body: IUserController.CreateDTO,
  ): Promise<IUserController.CreateResponse> {
    return this.userService.createUser(body);
  }

  @Put(':userId')
  @UseGuards(OnlyManagerGuard)
  @SwaggerDocs({
    response: IUserController.UpdateResponse,
    hasBearerToken: true,
  })
  async updateUser(
    @Param('userId') userId: number,
    @Body() body: IUserController.UpdateDTO,
  ): Promise<IUserController.UpdateResponse> {
    return this.userService.updateUser(Number(userId), body);
  }

  @Delete(':userId')
  @UseGuards(OnlyManagerGuard)
  @SwaggerDocs({
    response: IUserController.DeleteResponse,
    hasBearerToken: true,
  })
  async deleteUser(
    @Param('userId') userId: string,
  ): Promise<IUserController.DeleteResponse> {
    return this.userService.softDeleteUser(Number(userId));
  }

  @Post('getToken')
  @SwaggerDocs({ response: IUserController.GetTokenResponse })
  async getToken(
    @Body() body: IUserController.GetTokenDTO,
  ): Promise<IUserController.GetTokenResponse> {
    return this.userService.getToken(body);
  }
}
