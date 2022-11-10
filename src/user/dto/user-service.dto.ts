import { IUserController } from './user-controller.dto';

export namespace IUserService {
  export class CreateDTO extends IUserController.CreateDTO {}
  export class GetTokenDTO extends IUserController.GetTokenDTO {}
}
