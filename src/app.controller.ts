import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get('health')
  @ApiTags('public')
  async healthCheck() {
    return { isAlive: true };
  }
}
