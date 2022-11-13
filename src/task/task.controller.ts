import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JWTAuthControllerGuard } from '@/shared/guards/jwt-auth-controller.guard';
import { GetRequestUser } from '@/shared/decorators/get-request-user.decorator';
import { SwaggerDocs } from '@/shared/decorators/swagger.decorator';
import { RoleACLGuard } from '@/shared/guards/role-acl.guard';
import { IUser } from '@/user/dto/user.dto';
import { ITaskController } from './dto/task-controller.dto';
import { TaskProducer } from './task.producer';
import { TaskService } from './task.service';

const AuthGuard = JWTAuthControllerGuard();

@Controller('task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskProducer: TaskProducer,
  ) {}

  @Post()
  @UseGuards(RoleACLGuard('manager:true', 'technician:id:body'))
  @SwaggerDocs({
    response: ITaskController.CreateResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async create(
    @Body() body: ITaskController.CreateDTO,
  ): Promise<ITaskController.CreateResponse> {
    return await this.taskService.createTask(body);
  }

  @Get()
  @UseGuards(RoleACLGuard('manager:true', 'technician:id:query'))
  @SwaggerDocs({
    response: ITaskController.GetAllResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async getAll(
    @Query('userId') userId?: number,
  ): Promise<ITaskController.GetAllResponse> {
    return await this.taskService.findAllWithFilter({
      ...(userId && { userId }),
    });
  }

  @Delete(':taskId')
  @UseGuards(RoleACLGuard('manager:true', 'technician:false'))
  @SwaggerDocs({
    response: ITaskController.DeleteResponse,
    hasBearerToken: true,
    tag: 'manager',
  })
  async delete(
    @Param('taskId') taskId: number,
  ): Promise<ITaskController.DeleteResponse> {
    return await this.taskService.softDeleteTask(taskId);
  }

  @Put(':taskId')
  @UseGuards(RoleACLGuard('manager:true', 'technician:id:param', true))
  @SwaggerDocs({
    response: ITaskController.UpdateResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async update(
    @Param('taskId') taskId: number,
    @Body() body: ITaskController.UpdateDTO,
    @GetRequestUser() requestUser: IUser,
  ): Promise<ITaskController.UpdateResponse> {
    return await this.taskService.updateTask(
      taskId,
      body,
      requestUser.role,
      requestUser.id,
    );
  }

  @Post('finish')
  @UseGuards(RoleACLGuard('manager:true', 'technician:id:body'))
  @SwaggerDocs({
    response: ITaskController.FinishTaskResponse,
    hasBearerToken: true,
    tag: 'manager + technician',
  })
  async finishTask(
    @Body() body: ITaskController.FinishTaskDTO,
  ): Promise<ITaskController.FinishTaskResponse> {
    return this.taskProducer.finishTaskMessage(body);
  }
}
