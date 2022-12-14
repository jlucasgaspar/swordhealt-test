import { NotFoundException } from '@nestjs/common';
import { ITaskRepository } from '../dto/task-repository.dto';
import { TaskRepository } from '../task.repository';
import { ITask } from '../dto/task.dto';

export class TaskRepositoryMock implements TaskRepository {
  private db: ITask[] = [];

  cleanDatabase() {
    this.db = [];
  }

  insert: ITaskRepository.Insert = async (params) => {
    const taskData: ITask = {
      ...params,
      id: this.db.length + 1,
      createdAt: new Date(),
      finishedAt: null,
    };
    this.db.push(taskData);
    return taskData;
  };

  update: ITaskRepository.Update = async (id, params) => {
    let isOk = false;

    for (const index in this.db) {
      const task = this.db[index];

      if (task.id === id) {
        this.db[index] = {
          ...task,
          ...params,
          updatedAt: new Date(),
        };

        isOk = true;
        break;
      }
    }

    if (isOk) return true;

    throw new NotFoundException('task not found');
  };

  findAll: ITaskRepository.FindAll = async (filterParams) => {
    return this.db.filter((task) => {
      if (task.deletedAt) {
        return false;
      }

      const filterParamsObject = filterParams || {};

      for (const [key, value] of Object.entries(filterParamsObject)) {
        if (task[key] !== value) {
          return false;
        }
      }

      return true;
    });
  };

  findById: ITaskRepository.FindById = async (id) => {
    return this.db.find((task) => task.id === id);
  };

  softDelete: ITaskRepository.SoftDelete = async (id) => {
    let isOk = false;

    for (const index in this.db) {
      const task = this.db[index];

      if (task.id === id) {
        this.db[index] = {
          ...task,
          deletedAt: new Date(),
        };

        isOk = true;
        break;
      }
    }

    if (isOk) return true;

    throw new NotFoundException('task not found');
  };
}
