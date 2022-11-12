import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  NotFoundException,
} from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '@/user/user.repository';
import { IUser } from '@/user/dto/user.dto';

interface Params {
  publicRoutes?: string[];
}

interface HttpRequest extends Request {
  user?: IUser;
}

export function JWTAuthControllerGuard(params?: Params) {
  @Injectable()
  class JWTAuthControllerGuardClass implements CanActivate {
    constructor(
      readonly jwtService: JwtService,
      readonly userRepository: UserRepository,
    ) {}

    async canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<HttpRequest>();

      const { url, headers } = request;

      if (this.routeIsPublic(url)) {
        return true;
      }

      const bearerToken = this.transformAuthHeadersToBearerToken(headers);

      const userId = await this.transformBearerTokenToUserId(bearerToken);

      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new NotFoundException('information provided not found');
      }

      request.user = user;

      return true;
    }

    routeIsPublic(requestUrl: string) {
      const publicRoutes = params?.publicRoutes || [];
      for (const possiblePublicUrl of publicRoutes) {
        if (requestUrl.includes(possiblePublicUrl)) {
          return true;
        }
      }
      return false;
    }

    transformAuthHeadersToBearerToken(headers: IncomingHttpHeaders) {
      const { authorization } = headers;
      if (!authorization) {
        throw new ForbiddenException('no bearer token found');
      }

      const bearerToken = authorization.split('Bearer ')[1];
      if (!bearerToken) {
        throw new ForbiddenException('no bearer token found');
      }

      return bearerToken;
    }

    async transformBearerTokenToUserId(bearerToken: string) {
      try {
        await this.jwtService.verify(bearerToken);
      } catch (err) {
        throw new ForbiddenException(err.message);
      }
      type Token = Record<string, string>;
      const { sub: userId } = this.jwtService.decode(bearerToken) as Token;
      return Number(userId);
    }
  }

  return mixin(JWTAuthControllerGuardClass);
}
