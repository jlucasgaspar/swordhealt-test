import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EncryptProvider } from '@/shared/providers/encrypt.provider';
import { IUserService } from './dto/user-service.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly encrypterProvider: EncryptProvider,
  ) {}

  async createUser(params: IUserService.CreateDTO) {
    const emailExists = await this.userRepository.findByEmail(params.email);
    if (emailExists) {
      throw new BadRequestException('e-mail already exists');
    }

    params.password = await this.encrypterProvider.hash(params.password);

    const user = await this.userRepository.insert(params);

    const token = this.jwtService.sign({ sub: user.id });

    return { user, token };
  }

  async getToken(params: IUserService.GetTokenDTO) {
    const user = await this.userRepository.findByEmail(params.email, true);

    if (!user) {
      throw new NotFoundException('wrong email/password');
    }

    const passwordMatch = await this.encrypterProvider.compare({
      encryptedString: user.password,
      regularString: params.password,
    });

    if (!passwordMatch) {
      throw new BadRequestException('wrong password or email');
    }

    const token = this.jwtService.sign({ sub: user.id });

    return { token };
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll();
    return { users };
  }

  async updateUser(userId: number, params: IUserService.UpdateDTO) {
    if (params.password) {
      params.password = await this.encrypterProvider.hash(params.password);
    }
    const updated = await this.userRepository.update(userId, params);
    return { updated };
  }

  async softDeleteUser(userId: number) {
    const deleted = await this.userRepository.softDelete(userId);
    return { deleted };
  }
}
