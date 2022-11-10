import { Body, Controller, Post } from '@nestjs/common';
import { IUserController } from './dto/user-controller.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('getToken')
  async getToken(@Body() body: IUserController.GetTokenDTO) {
    return this.userService.getToken(body);
  }
}
