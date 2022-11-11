import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { IUser } from './user.dto';

export namespace IUserRepository {
  export type Insert = (
    params: WithoutTimestampsAndId<IUser>,
  ) => Promise<IUser>;

  export type FindByEmail = (
    email: string,
    returnPassword?: boolean,
  ) => Promise<IUser | null>;

  export type FindById = (id: number) => Promise<IUser | null>;

  export type FindAll = () => Promise<IUser[]>;

  export type Update = (id: number, params: Partial<IUser>) => Promise<boolean>;

  export type SoftDelete = (id: number) => Promise<boolean>;
}
