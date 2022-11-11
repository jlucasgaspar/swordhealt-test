import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    if (!authorization) {
      throw new ForbiddenException('no bearer token found');
    }

    const bearerToken = authorization.split('Bearer ')[1];
    if (!bearerToken) {
      throw new ForbiddenException('no bearer token found');
    }

    try {
      await this.jwtService.verify(bearerToken);
    } catch (err) {
      throw new ForbiddenException(err.message);
    }

    type Token = Record<string, string>;
    const { sub: userId } = this.jwtService.decode(bearerToken) as Token;

    const user = await this.userRepository.findById(Number(userId));
    if (!user) {
      throw new NotFoundException('information provided not found');
    }

    request.user = user;

    return true;
  }
}
