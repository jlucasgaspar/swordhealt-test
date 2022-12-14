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
    const result = sut.updateTask(1, taskDto, 'technician', 1);
    expect(result).rejects.toThrow(BadRequestException);
  });

  it('should throw if userId is provided but this userId does not exists', async () => {
    const result = sut.updateTask(1, { userId: 99999 }, 'manager', 1);
    expect(result).rejects.toThrow(NotFoundException);
  });

  it('should throw if requestUserId is not the same from userId in task, and this requestUser role is a technician', async () => {
    const createdTask = await taskRepositoryMock.insert({
      userId: 1,
      summary: 'summary',
    });
    const result = sut.updateTask(
      createdTask.id,
      { summary: 'new summary' },
      'technician',
      2000,
    );
    expect(result).rejects.toThrow(BadRequestException);
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
      1,
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

describe('softDeleteTask', () => {
  beforeEach(beforeEachFunction);

  it('should return a boolean if everything is ok', async () => {
    const createdTask = await taskRepositoryMock.insert({
      summary: 'summary',
      userId: 1,
    });
    const result = await sut.softDeleteTask(createdTask.id);
    expect(result.deleted).toBeTruthy();
  });
});

describe('finishTask', () => {
  beforeEach(beforeEachFunction);

  it('should throw if userId provided is not found', async () => {
    const result = await sut.finishTask({
      finishedAt: new Date().toISOString(),
      taskId: 100000,
      userId: 100000,
    });
    expect(result.isOk).toBeFalsy();
  });

  it('should throw if taskId provided is not found', async () => {
    const createdUser = await userRepositoryMock.insert({
      email: 'email@mail.com',
      name: 'user test',
      password: '123456',
      role: 'manager',
    });
    const result = await sut.finishTask({
      finishedAt: new Date().toISOString(),
      taskId: 100000,
      userId: createdUser.id,
    });
    expect(result.isOk).toBeFalsy();
  });

  it('should throw if userId does not belongs to taskId', async () => {
    const createdUser = await userRepositoryMock.insert({
      email: 'email@mail.com',
      name: 'user test',
      password: '123456',
      role: 'manager',
    });
    const userIdWrong = createdUser.id + 199999;
    const createdTask = await taskRepositoryMock.insert({
      userId: userIdWrong,
      summary: 'summary',
    });
    const result = await sut.finishTask({
      finishedAt: new Date().toISOString(),
      taskId: createdTask.id,
      userId: createdUser.id,
    });
    expect(result.isOk).toBeFalsy();
  });

  it('should return a success message if everything is ok', async () => {
    const createdUser = await userRepositoryMock.insert({
      email: 'email@mail.com',
      name: 'user test',
      password: '123456',
      role: 'manager',
    });
    const createdTask = await taskRepositoryMock.insert({
      userId: createdUser.id,
      summary: 'summary',
    });
    const result = await sut.finishTask({
      finishedAt: new Date().toISOString(),
      taskId: createdTask.id,
      userId: createdUser.id,
    });
    expect(result.isOk).toBeTruthy();
  });
});
