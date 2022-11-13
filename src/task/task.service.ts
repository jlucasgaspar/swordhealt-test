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
  ) {
    if (params.userId && requestUserRole === 'technician') {
      throw new BadRequestException('Only manager can change userId of a task');
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
      notFoundMessage = `User ID provided not found: ${userId}`;
    }

    if (!task) {
      notFoundMessage = `Task ID provided not found: ${taskId}`;
    }

    if (notFoundMessage) {
      console.error(notFoundMessage);
      throw new NotFoundException(notFoundMessage);
    }

    if (task.userId !== userId) {
      const errorMessage = `userId ${userId} does not belongs to taskId ${taskId}`;
      console.error(errorMessage);
      throw new BadRequestException(errorMessage);
    }

    await this.taskRepository.update(taskId, {
      finishedAt: new Date(finishedAt),
    });

    const successMessage = `User ${user.name} finished task ${taskId} at time ${finishedAt}`;

    console.log(successMessage);

    return {
      message: successMessage,
    };
  }
}
