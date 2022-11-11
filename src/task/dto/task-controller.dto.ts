import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ITask } from '@/task/dto/task.dto';
import * as Joi from 'joi';

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

export namespace ITaskController {
  export class CreateDTO extends ICreateDTO {}
  export class CreateResponse extends ICreateResponse {}

  export class UpdateDTO extends IUpdateDTO {}
  export class UpdateResponse extends IUpdateResponse {}
}
