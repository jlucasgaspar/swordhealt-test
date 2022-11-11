import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { IUser, IUserRole } from '@/user/dto/user.dto';
import * as Joi from 'joi';

/*
 * GET /user
 */
class IGetAllDTO {}
class IGetAllResponse {
  @ApiProperty({ type: IUser, isArray: true })
  users: IUser[];
}

/*
 * POST /user
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class ICreateDTO {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().email().required())
  email: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  name: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  password: string;

  @ApiProperty({ enum: ['manager', 'technician'] })
  @JoiSchema(Joi.string().required().valid('manager', 'technician'))
  role: IUserRole;
}
class ICreateResponse {
  @ApiProperty({ type: IUser })
  user: IUser;
  @ApiProperty({ type: String })
  token: string;
}

/*
 * PUT /user/:userId
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IUpdateDTO {
  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().email().optional())
  email?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  name?: string;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional())
  password?: string;

  @ApiPropertyOptional({ enum: ['manager', 'technician'] })
  @JoiSchema(Joi.string().optional().valid('manager', 'technician'))
  role?: IUserRole;
}
class IUpdateResponse {
  @ApiProperty({ type: Boolean })
  updated: boolean;
}

/*
 * DELETE /user/:userId
 */
class IDeleteDTO {}
class IDeleteResponse {
  @ApiProperty({ type: Boolean })
  deleted: boolean;
}

/*
 * POST /user/getToken
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IGetTokenDTO {
  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().email().required())
  email: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  password: string;
}
class IGetTokenResponse {
  @ApiProperty({ type: String })
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
