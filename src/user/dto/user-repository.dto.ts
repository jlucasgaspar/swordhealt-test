import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { IUser } from './user.dto';

export interface IUserRepository {
  insert(params: WithoutTimestampsAndId<IUser>): Promise<IUser>;
  findByEmail(email: string, returnPassword?: boolean): Promise<IUser | null>;
  findById(id: number): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: number, params: Partial<IUser>): Promise<boolean>;
  softDelete(id: number): Promise<boolean>;
}
