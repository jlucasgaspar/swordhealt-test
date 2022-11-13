import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { IUserRole } from '@/user/dto/user.dto';
import { ITaskService } from './dto/task-service.dto';
import { TaskRepository } from './task.repository';
import { FinishTaskDTO } from './dto/task.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createTask(params: ITaskService.CreateDTO) {
    const userExists = await this.userRepository.findById(params.userId);
    if (!userExists) {
      throw new NotFoundException('userId provided not exists');
    }
    const task = await this.taskRepository.insert(params);
    return { task };
  }

  async updateTask(
    taskId: number,
    params: ITaskService.UpdateDTO,
    requestUserRole: IUserRole,
    requestUserId: number,
  ) {
    if (params.userId && requestUserRole === 'technician') {
      throw new BadRequestException('Only manager can change userId of a task');
    }

    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException('task not found');
    }

    if (task.userId !== requestUserId && requestUserRole === 'technician') {
      throw new BadRequestException(
        'you can not change others technicians task',
      );
    }

    const updated = await this.taskRepository.update(taskId, params);
    return { updated };
  }

  async findAllWithFilter(filterParams?: ITaskService.GetAllDTO) {
    const tasks = await this.taskRepository.findAll(filterParams);
    return { tasks };
  }

  async softDeleteTask(taskId: number) {
    const deleted = await this.taskRepository.softDelete(taskId);
    return { deleted };
  }

  async finishTask({ finishedAt, taskId, userId }: FinishTaskDTO) {
    const [user, task] = await Promise.all([
      this.userRepository.findById(userId),
      this.taskRepository.findById(taskId),
    ]);

    let notFoundMessage = '';

    if (!user) {
      notFoundMessage = `Data provided not found: userId ${userId}`;
    }

    if (!task) {
      notFoundMessage = `Data provided not found: taskId ${taskId}`;
    }

    if (notFoundMessage) {
      console.log('\x1b[31m', notFoundMessage);
      return {
        isOk: false,
        message: notFoundMessage,
      };
    }

    if (task.userId !== userId) {
      const errorMessage = `userId ${userId} does not belongs to taskId ${taskId}`;
      console.error('\x1b[31m', errorMessage);
      return {
        isOk: false,
        message: errorMessage,
      };
    }

    const successMessage = `User ${user.name} finished task ${taskId} at time ${finishedAt}`;

    console.log('\x1b[32m', successMessage);

    return {
      isOk: true,
      message: successMessage,
    };
  }
}
