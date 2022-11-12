import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRepositoryMock } from '@/user/__mocks__/user-repository.mock';
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

  it('should throw if userId provided do not exists', async () => {
    const taskDto = { userId: 2, summary: 'summary' };
    const result = sut.createTask(taskDto);
    expect(result).rejects.toThrow(NotFoundException);
  });

  it('should return the created task if everything is ok', async () => {
    const createdUser = await userRepositoryMock.insert({
      email: 'email@mail.com',
      password: '123456',
      name: 'name',
      role: 'manager',
    });
    const taskDto = { userId: createdUser.id, summary: 'summary' };
    const result = await sut.createTask(taskDto);
    expect(result.task).toBeTruthy();
  });
});

describe('updateTask', () => {
  beforeEach(beforeEachFunction);

  it('should throw if userId is provided but requestUser is not a manager', async () => {
    const taskDto = { userId: 2 };
    const result = sut.updateTask(1, taskDto, 'technician');
    expect(result).rejects.toThrow(BadRequestException);
  });

  it('should throw if userId is provided but this userId does not exists', async () => {
    const result = sut.updateTask(1, { userId: 99999 }, 'manager');
    expect(result).rejects.toThrow(NotFoundException);
  });

  it('should return a task if everything is ok', async () => {
    const createdUser = await userRepositoryMock.insert({
      email: 'mail@mail.com',
      password: '123456',
      name: 'name',
      role: 'manager',
    });
    const taskDto = { summary: 'summary', userId: createdUser.id };
    const createdTask = await sut.createTask(taskDto);
    const result = await sut.updateTask(
      createdTask.task.id,
      { summary: 'new summary' },
      'manager',
    );
    expect(result.updated).toBeTruthy();
  });
});

describe('findAllWithFilter', () => {
  beforeEach(beforeEachFunction);

  it('should return tasks array if everythin is ok', async () => {
    await taskRepositoryMock.insert({
      summary: 'summary',
      userId: 1,
    });
    await taskRepositoryMock.insert({
      summary: 'summary',
      userId: 2,
    });
    const result = await sut.findAllWithFilter();
    const resultWithUserIdFilter = await sut.findAllWithFilter({ userId: 1 });
    expect(result.tasks).toHaveLength(2);
    expect(resultWithUserIdFilter.tasks).toHaveLength(1);
  });
});
