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

  async finishTask({ finishedAt, taskId, userId }: FinishTaskDTO) {
    const [user, isUpdated] = await Promise.all([
      this.userRepository.findById(userId),
      this.taskRepository.update(taskId, { finishedAt }),
    ]);

    if (!user) {
      const errorMessage = `Task ID ${taskId} finished: ${isUpdated}. User ID ${userId} not found.`;
      console.error(errorMessage);
      throw new NotFoundException(errorMessage);
    }

    console.log(
      `User ${user.name} finished task ${taskId} at time ${finishedAt}`,
    );
  }
}
