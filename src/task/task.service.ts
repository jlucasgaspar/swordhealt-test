import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { IUserRole } from '@/user/dto/user.dto';
import { ITaskService } from './dto/task-service.dto';
import { TaskRepository } from './task.repository';

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
}
