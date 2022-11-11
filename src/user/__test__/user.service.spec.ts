import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptProvider } from '@/shared/providers/encrypt.provider';
import { UserRepositoryMock } from '../__mocks__/user-repository.mock';
import { UserService } from '../user.service';

describe(UserService.name, () => {
  let sut: UserService;
  const userRepositoryMock = new UserRepositoryMock();
  const encrypterProvider = new EncryptProvider();
  const jwtService = new JwtService();

  beforeAll(() => {
    jest.spyOn(jwtService, 'sign').mockImplementation(() => {
      return 'jwt_token';
    });
  });

  beforeEach(() => {
    userRepositoryMock.cleanDatabase();

    sut = new UserService(userRepositoryMock, jwtService, encrypterProvider);
  });

  describe('createUser', () => {
    it('should throw if the email already exists', async () => {
      const userData = {
        email: 'wrong_email@mail.com',
        password: '123456',
        name: 'user_name',
      };
      await userRepositoryMock.insert({ ...userData, role: 'technician' });
      const result = sut.createUser({ ...userData, role: 'technician' });
      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return user and token if everything is ok', async () => {
      const userData = {
        email: 'ok_email@mail.com',
        password: '123456',
        name: 'user_name',
      };
      const result = await sut.createUser({ ...userData, role: 'technician' });
      expect(result.token).toBeTruthy();
      expect(result.user).toBeTruthy();
    });
  });

  describe('getToken', () => {
    it('should throw if the email provided do not exists', async () => {
      const result = sut.getToken({
        email: 'email_that_not_exists@gmail.com',
        password: '123456',
      });
      expect(result).rejects.toThrow(NotFoundException);
    });

    it('should throw if passwords do not match', async () => {
      const email = 'email@mail.com';
      await sut.createUser({
        email,
        password: '123456',
        name: 'name',
        role: 'manager',
      });
      const result = sut.getToken({ email, password: 'wrong_pwd' });
      expect(result).rejects.toThrow(BadRequestException);
    });

    it('should return token if everything is ok', async () => {
      const emailAndPassword = {
        email: 'email@mail.com',
        password: '123456',
      };
      await sut.createUser({
        ...emailAndPassword,
        name: 'name',
        role: 'manager',
      });
      const result = await sut.getToken(emailAndPassword);
      expect(result.token).toBeTruthy();
    });
  });

  describe('getAllUsers', () => {
    it('should get all users if everything is ok', async () => {
      await userRepositoryMock.insert({
        email: 'email1@mail.com',
        password: '123456',
        name: 'name 1',
        role: 'manager',
      });
      await userRepositoryMock.insert({
        email: 'email2@mail.com',
        password: '123456',
        name: 'name 2',
        role: 'manager',
      });
      const result = await sut.getAllUsers();
      expect(result.users).toHaveLength(2);
    });
  });

  describe('updateUser', () => {
    it('should throw if userId provider do not exists', async () => {
      const result = sut.updateUser(100, { name: 'updated name' });
      expect(result).rejects.toThrow(NotFoundException);
    });

    it('should update user if everything is ok', async () => {
      const createdUser = await userRepositoryMock.insert({
        email: 'email1@mail.com',
        password: '123456',
        name: 'name 1',
        role: 'manager',
      });
      const result = await sut.updateUser(createdUser.id, {
        name: 'updated name',
      });
      expect(result.updated).toBeTruthy();
    });
  });

  describe('softDeleteUser', () => {
    it('should throw if userId provider do not exists', async () => {
      const result = sut.softDeleteUser(100);
      expect(result).rejects.toThrow(NotFoundException);
    });

    it('should delete user if everything is ok', async () => {
      const createdUser = await userRepositoryMock.insert({
        email: 'email1@mail.com',
        password: '123456',
        name: 'name 1',
        role: 'manager',
      });
      const result = await sut.softDeleteUser(createdUser.id);
      expect(result.deleted).toBeTruthy();
    });
  });
});
