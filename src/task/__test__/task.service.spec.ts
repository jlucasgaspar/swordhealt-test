import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepositoryMock } from '@/user/__mocks__/user-repository.mock';
import { IUser } from '@/user/dto/user.dto';
import { TaskRepositoryMock } from '../__mocks__/task-repository.mock';
import { TaskService } from '../task.service';

let sut: TaskService;
const userRepositoryMock = new UserRepositoryMock();
const taskRepositoryMock = new TaskRepositoryMock();

function beforeEachFunction() {
  userRepositoryMock.cleanDatabase();
  taskRepositoryMock.cleanDatabase();

  sut = new TaskService(taskRepositoryMock, userRepositoryMock);
}

describe('createTask', () => {
  beforeEach(beforeEachFunction);

  it('should throw if user is trying to create a task for anothet user, but it is not a manager', async () => {
    const taskDto = { userId: 1, summary: 'summary' };
    const requestUser = { id: 2, role: 'technician' } as IUser;
    const result = sut.createTask(taskDto, requestUser);
    expect(result).rejects.toThrow(BadRequestException);
  });

  it('should throw if userId provided do not exists', async () => {
    const taskDto = { userId: 2, summary: 'summary' };
    const requestUser = { id: 2, role: 'technician' } as IUser;
    const result = sut.createTask(taskDto, requestUser);
    expect(result).rejects.toThrow(NotFoundException);
  });

  it('should return the created task if everything is ok', async () => {
    const createUser = await userRepositoryMock.insert({
      email: 'email@mail.com',
      password: '123456',
      name: 'name',
      role: 'manager',
    });
    const taskDto = { userId: createUser.id, summary: 'summary' };
    const result = await sut.createTask(taskDto, createUser);
    expect(result.task).toBeTruthy();
  });
});

describe('updateTask', () => {
  beforeEach(beforeEachFunction);

  it('should throw if userId is provided but requestUser is not a manager', async () => {
    const taskDto = { userId: 2 };
    const requestUser = { role: 'technician' } as IUser;
    const result = sut.updateTask(1, taskDto, requestUser);
    expect(result).rejects.toThrow(BadRequestException);
  });
});
