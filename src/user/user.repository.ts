import { databaseHelper } from '@/shared/helpers/database.helper';
import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { Injectable } from '@nestjs/common';
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

  async findByEmail(
    email: string,
    returnWithPassword?: boolean,
  ): Promise<IUser | null> {
    const user = await this.table().where('email', email).first();
    if (!user) return null;
    if (returnWithPassword) return user;
    delete user.password;
    return user;
  }
}
