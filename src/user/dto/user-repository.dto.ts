import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { IUser } from './user.dto';

export interface IUserRepository {
  insert(params: WithoutTimestampsAndId<IUser>): Promise<IUser>;
}
