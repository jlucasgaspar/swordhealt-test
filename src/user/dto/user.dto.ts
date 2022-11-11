import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import * as Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class IUser {
  @ApiProperty({ type: Number })
  @JoiSchema(Joi.number().required())
  id: number;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  name: string;

  @ApiProperty({ enum: ['manager', 'technician'] })
  @JoiSchema(Joi.string().required().valid('manager', 'technician'))
  role: IUserRole;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().email().required())
  email: string;

  @ApiProperty({ type: String })
  @JoiSchema(Joi.string().required())
  password: string;

  @ApiProperty({ type: Date })
  @JoiSchema(Joi.date().required())
  createdAt: Date;

  @ApiPropertyOptional({ type: Date })
  @JoiSchema(Joi.date().optional())
  updatedAt?: Date | null;

  @ApiPropertyOptional({ type: Date })
  @JoiSchema(Joi.date().optional())
  deletedAt?: Date | null;
}

export type IUserRole = 'manager' | 'technician';
