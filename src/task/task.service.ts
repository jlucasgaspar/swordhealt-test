import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { IUser } from '@/user/dto/user.dto';
import { ITaskService } from './dto/task-service.dto';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async createTask(params: ITaskService.CreateDTO, requestUser: IUser) {
    if (requestUser.role === 'technician' && requestUser.id !== params.userId) {
      throw new BadRequestException(
        'you can not make request for a different technician',
      );
    }
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
    requestUser: IUser,
  ) {
    if (params.userId) {
      if (requestUser.role === 'technician') {
        throw new BadRequestException(
          'Only manager can change userId of a task',
        );
      }
      const userExists = await this.userRepository.findById(params.userId);
      if (!userExists) {
        throw new NotFoundException('userId provided not exists');
      }
    }
    const updated = await this.taskRepository.update(taskId, params);
    return { updated };
  }
}
