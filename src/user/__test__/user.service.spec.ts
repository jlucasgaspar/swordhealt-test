import { BadRequestException } from '@nestjs/common';
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
    jest.spyOn(encrypterProvider, 'compare').mockImplementation(async () => {
      return true;
    });
    jest.spyOn(encrypterProvider, 'hash').mockImplementation(async () => {
      return 'hashed_password';
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
});
