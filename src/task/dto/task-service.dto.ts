import { ITaskController } from './task-controller.dto';
import { ITask } from './task.dto';

export namespace ITaskService {
  export type GetAllDTO = Partial<Pick<ITask, 'userId'>>;
  export type CreateDTO = ITaskController.CreateDTO;
  export type UpdateDTO = ITaskController.UpdateDTO;
}
