import { Injectable, NotFoundException } from '@nestjs/common';
import { databaseHelper } from '@/shared/helpers/database.helper';
import { ITask } from './dto/task.dto';
import { ITaskRepository } from './dto/task-repository.dto';

function table() {
  return databaseHelper.getTable<ITask>('tasks');
}

@Injectable()
export class TaskRepository {
  insert: ITaskRepository.Insert = async (params) => {
    const result = await table().insert(params);
    const createdId = result[0] as number;
    return {
      id: createdId,
      ...params,
      createdAt: new Date(),
      finishedAt: null,
    };
  };

  update: ITaskRepository.Update = async (id, params) => {
    const now = databaseHelper.knex.fn.now();
    if (params.updatedAt) {
      params.updatedAt = now as any as Date;
    }
    const result = await table()
      .where('id', id)
      .update({
        ...params,
        updatedAt: now,
      });
    if (Boolean(result)) {
      return true;
    }
    throw new NotFoundException('task not found');
  };

  findAll: ITaskRepository.FindAll = async (filterParams) => {
    const query = table();

    const filterParamsObject = filterParams || {};

    for (const [key, value] of Object.entries(filterParamsObject)) {
      query.where(key, value);
    }

    return await query.whereNull('deletedAt');
  };

  softDelete: ITaskRepository.SoftDelete = async (id) => {
    const result = await table()
      .where('id', id)
      .update({ deletedAt: databaseHelper.knex.fn.now() });
    if (Boolean(result)) {
      return true;
    }
    throw new NotFoundException('task not found');
  };
}
