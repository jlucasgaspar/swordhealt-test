import { databaseHelper } from '@/shared/helpers/database.helper';
import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { Injectable, NotFoundException } from '@nestjs/common';
import knex from 'knex';
import knexConfig from 'knexfile';
import { IUserRepository } from './dto/user-repository.dto';
import { IUser } from './dto/user.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  private table() {
    return databaseHelper.getTable<IUser>('users');
  }

  async insert(params: WithoutTimestampsAndId<IUser>): Promise<IUser> {
    const result = await this.table().insert(params);
    const createdId = result[0] as number;
    return { id: createdId, ...params, createdAt: new Date() };
  }

  async findById(id: number): Promise<IUser | null> {
    const user = await this.table()
      .where('id', id)
      .whereNull('deletedAt')
      .first();
    if (!user) return null;
    delete user.password;
    return user;
  }

  async findByEmail(
    email: string,
    returnWithPassword?: boolean,
  ): Promise<IUser | null> {
    const user = await this.table()
      .where('email', email)
      .whereNull('deletedAt')
      .first();
    if (!user) return null;
    if (returnWithPassword) return user;
    delete user.password;
    return user;
  }

  async findAll(): Promise<IUser[]> {
    return await this.table().whereNull('deletedAt');
  }

  async update(id: number, params: Partial<IUser>): Promise<boolean> {
    const result = await this.table()
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
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.table()
      .where('id', id)
      .update({ deletedAt: databaseHelper.knex.fn.now() });
    if (Boolean(result)) {
      return true;
    }
    throw new NotFoundException('user not found');
  }
}
