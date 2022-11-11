import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { IUser, IUserRole } from '@/user/dto/user.dto';
import * as Joi from 'joi';

/*
 * GET /user
 */
class IGetAllDTO {}
class IGetAllResponse {
  users: IUser[];
}

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

  @JoiSchema(Joi.string().required().valid('manager', 'technician'))
  role: IUserRole;
}
class ICreateResponse {
  user: IUser;
  token: string;
}

/*
 * PUT /user/:userId
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IUpdateDTO {
  @JoiSchema(Joi.string().email().optional())
  email: string;

  @JoiSchema(Joi.string().optional())
  name: string;

  @JoiSchema(Joi.string().optional())
  password: string;

  @JoiSchema(Joi.string().optional().valid('manager', 'technician'))
  role: IUserRole;
}
class IUpdateResponse {
  updated: boolean;
}

/*
 * DELETE /user/:userId
 */
class IDeleteDTO {}
class IDeleteResponse {
  deleted: boolean;
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
  export class GetAllDTO extends IGetAllDTO {}
  export class GetAllResponse extends IGetAllResponse {}

  export class CreateDTO extends ICreateDTO {}
  export class CreateResponse extends ICreateResponse {}

  export class UpdateDTO extends IUpdateDTO {}
  export class UpdateResponse extends IUpdateResponse {}

  export class DeleteDTO extends IDeleteDTO {}
  export class DeleteResponse extends IDeleteResponse {}

  export class GetTokenDTO extends IGetTokenDTO {}
  export class GetTokenResponse extends IGetTokenResponse {}
}
