import { NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../dto/user-repository.dto';
import { UserRepository } from '../user.repository';
import { IUser } from '../dto/user.dto';

export class UserRepositoryMock implements UserRepository {
  private db: IUser[] = [];

  cleanDatabase() {
    this.db = [];
  }

  insert: IUserRepository.Insert = async (params) => {
    const userData: IUser = {
      ...params,
      id: this.db.length + 1,
      createdAt: new Date(),
    };
    this.db.push(userData);
    return userData;
  };

  findByEmail: IUserRepository.FindByEmail = async (email) => {
    const user = this.db.find((u) => u.email === email);
    if (!user) return null;
    return user;
  };

  findById: IUserRepository.FindById = async (id) => {
    const user = this.db.find((u) => u.id === id);
    if (!user) return null;
    return user;
  };

  findAll: IUserRepository.FindAll = async () => {
    return this.db;
  };

  update: IUserRepository.Update = async (id, params) => {
    let isOk = false;

    for (const index in this.db) {
      const user = this.db[index];

      if (user.id === id) {
        this.db[index] = {
          ...user,
          ...params,
          updatedAt: new Date(),
        };

        isOk = true;
        break;
      }
    }

    if (isOk) return true;

    throw new NotFoundException('user not found');
  };

  softDelete: IUserRepository.SoftDelete = async (id) => {
    let isOk = false;

    for (const index in this.db) {
      const user = this.db[index];

      if (user.id === id) {
        this.db[index] = {
          ...user,
          deletedAt: new Date(),
        };

        isOk = true;
        break;
      }
    }

    if (isOk) return true;

    throw new NotFoundException('user not found');
  };
}
