import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ITask } from '@/task/dto/task.dto';
import * as Joi from 'joi';

/*
 * GET /task?userId=''
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IGetAllDTO {}
class IGetAllResponse {
  tasks: ITask[];
}

/*
 * POST /task
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class ICreateDTO {
  @ApiProperty({ type: Number })
  @JoiSchema(Joi.number().required())
  userId: number;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required().max(2500))
  summary: string;
}
class ICreateResponse {
  @ApiProperty({ type: ITask })
  task: ITask;
}

/*
 * PUT /task/:taskId
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IUpdateDTO {
  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().optional())
  userId?: number;

  @ApiPropertyOptional({ type: String })
  @JoiSchema(Joi.string().optional().max(2500))
  summary?: string;
}
class IUpdateResponse {
  @ApiProperty({ type: Boolean })
  updated: boolean;
}

/*
 * DELETE /task/:taskId
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IDeleteDTO {}
class IDeleteResponse {
  @ApiProperty({ type: Boolean })
  deleted: boolean;
}

/*
 * POST /task/finish
 */
@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
class IFinishTaskDTO {
  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().required())
  userId: number;

  @ApiPropertyOptional({ type: Number })
  @JoiSchema(Joi.number().required())
  taskId: number;
}
class IFinishTaskResponse {
  @ApiProperty({ type: Boolean })
  sentToQueue: boolean;
}

export namespace ITaskController {
  export class GetAllDTO extends IGetAllDTO {}
  export class GetAllResponse extends IGetAllResponse {}

  export class CreateDTO extends ICreateDTO {}
  export class CreateResponse extends ICreateResponse {}

  export class UpdateDTO extends IUpdateDTO {}
  export class UpdateResponse extends IUpdateResponse {}

  export class DeleteDTO extends IDeleteDTO {}
  export class DeleteResponse extends IDeleteResponse {}

  export class FinishTaskDTO extends IFinishTaskDTO {}
  export class FinishTaskResponse extends IFinishTaskResponse {}
}
