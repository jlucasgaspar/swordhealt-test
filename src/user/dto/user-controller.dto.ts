import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { IUser, IUserRole } from '@/user/dto/user.dto';
import * as Joi from 'joi';

/*
 * POST /user
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class ICreateDTO {
  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  name: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(Joi.string().required())
  role: IUserRole;
}
class ICreateResponse {
  user: IUser;
}

/*
 * POST /user/getToken
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IGetTokenDTO {
  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
class IGetTokenResponse {
  token: string;
}

export namespace IUserController {
  export class CreateDTO extends ICreateDTO {}
  export class CreateResponse extends ICreateResponse {}
  export class GetTokenDTO extends IGetTokenDTO {}
  export class GetTokenResponse extends IGetTokenResponse {}
}
