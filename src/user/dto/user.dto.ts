import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({ allowUnknown: false, abortEarly: false })
export class IUser {
  @JoiSchema(Joi.number().required())
  id: number;

  @JoiSchema(Joi.string().required())
  name: string;

  @JoiSchema(Joi.string().required().valid('manager', 'technician'))
  role: IUserRole;

  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(Joi.date().required())
  createdAt: Date;

  @JoiSchema(Joi.date().optional())
  updatedAt?: Date | null;

  @JoiSchema(Joi.date().optional())
  deletedAt?: Date | null;
}

export type IUserRole = 'manager' | 'technician';
