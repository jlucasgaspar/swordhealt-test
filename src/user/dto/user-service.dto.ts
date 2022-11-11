import { IUserController } from './user-controller.dto';

export namespace IUserService {
  export class GetAllDTO extends IUserController.GetAllDTO {}
  export class CreateDTO extends IUserController.CreateDTO {}
  export class UpdateDTO extends IUserController.UpdateDTO {}
  export class GetTokenDTO extends IUserController.GetTokenDTO {}
}
