import { ITaskController } from './task-controller.dto';

export namespace ITaskService {
  export class CreateDTO extends ITaskController.CreateDTO {}
  export class UpdateDTO extends ITaskController.UpdateDTO {}
}
