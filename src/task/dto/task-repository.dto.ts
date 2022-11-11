import { WithoutTimestampsAndId } from '@/shared/helpers/types.helper';
import { ITask } from './task.dto';

export namespace ITaskRepository {
  export type Insert = (
    params: WithoutTimestampsAndId<ITask>,
  ) => Promise<ITask>;

  export type Update = (id: number, params: Partial<ITask>) => Promise<boolean>;

  export type SoftDelete = (id: number) => Promise<boolean>;
}