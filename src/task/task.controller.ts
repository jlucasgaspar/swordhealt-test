import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { SwaggerDocs } from '@/shared/decorators/swagger.decorator';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { User } from '@/shared/decorators/user.decorator';
import { IUser } from '@/user/dto/user.dto';
import { ITaskController } from './dto/task-controller.dto';
import { TaskService } from './task.service';

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @SwaggerDocs({
    response: ITaskController.CreateResponse,
    hasBearerToken: true,
  })
  async create(
    @Body() body: ITaskController.CreateDTO,
    @User() requestUser: IUser,
  ): Promise<ITaskController.CreateResponse> {
    return await this.taskService.createTask(body, requestUser);
  }

  @Put(':taskId')
  @SwaggerDocs({
    response: ITaskController.UpdateResponse,
    hasBearerToken: true,
  })
  async update(
    @Param('taskId') taskId: number,
    @Body() body: ITaskController.UpdateDTO,
    @User() requestUser: IUser,
  ): Promise<ITaskController.UpdateResponse> {
    return await this.taskService.updateTask(taskId, body, requestUser);
  }
}
