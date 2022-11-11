import { Injectable, NotFoundException } from '@nestjs/common';
import { databaseHelper } from '@/shared/helpers/database.helper';
import { IUserRepository } from './dto/user-repository.dto';
import { IUser } from './dto/user.dto';

function table() {
  return databaseHelper.getTable<IUser>('users');
}

@Injectable()
export class UserRepository {
  insert: IUserRepository.Insert = async (params) => {
    const result = await table().insert(params);
    const createdId = result[0] as number;
    return { id: createdId, ...params, createdAt: new Date() };
  };

  findById: IUserRepository.FindById = async (id) => {
    const user = await table().where('id', id).whereNull('deletedAt').first();
    if (!user) return null;
    delete user.password;
    return user;
  };

  findByEmail: IUserRepository.FindByEmail = async (
    email: string,
    returnWithPassword?: boolean,
  ) => {
    const user = await table()
      .where('email', email)
      .whereNull('deletedAt')
      .first();
    if (!user) return null;
    if (returnWithPassword) return user;
    delete user.password;
    return user;
  };

  findAll: IUserRepository.FindAll = async () => {
    return await table().whereNull('deletedAt');
  };

  update: IUserRepository.Update = async (id, params) => {
    const result = await table()
      .where('id', id)
      .whereNull('deletedAt')
      .update({
        ...params,
        updatedAt: databaseHelper.knex.fn.now(),
      });
    if (Boolean(result)) {
      return true;
    }
    throw new NotFoundException('user not found');
  };

  softDelete: IUserRepository.SoftDelete = async (id) => {
    const result = await table()
      .where('id', id)
      .update({ deletedAt: databaseHelper.knex.fn.now() });
    if (Boolean(result)) {
      return true;
    }
    throw new NotFoundException('user not found');
  };
}
