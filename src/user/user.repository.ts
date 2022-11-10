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
    const [user] = await this.table().insert(params, '*');
    delete user.password;
    return user;
  }
}
