import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnprocessableEntityException,
  NotImplementedException,
  Injectable,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';
import { IUser } from '@/user/dto/user.dto';

interface HttpRequest extends Request {
  user?: IUser;
}

type ManagerAccess = 'manager:true' | 'manager:false';

type TechnicianAccess =
  | 'technician:false'
  | 'technician:id:body'
  | 'technician:id:param'
  | 'technician:id:query';

export function RoleACLGuard(
  managerAccess: ManagerAccess,
  technicianAccess: TechnicianAccess,
) {
  @Injectable()
  class RoleGuardClass implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      const request = context.switchToHttp().getRequest<HttpRequest>();

      if (!request.user) {
        throw new NotImplementedException('user not found in request');
      }

      if (
        technicianAccess === 'technician:false' &&
        request.user.role === 'technician'
      ) {
        throw new ForbiddenException('access forbidden');
      }

      if (
        managerAccess === 'manager:false' &&
        request.user.role === 'manager'
      ) {
        throw new ForbiddenException('forbidden access');
      }

      if (request.user.role === 'manager') {
        return true;
      }

      if (technicianAccess.includes('technician:id:')) {
        return this.validateTechnician(request, technicianAccess);
      }

      throw new NotImplementedException('something went wrong in roles ACL');
    }

    validateTechnician(
      request: HttpRequest,
      technicianAccess: TechnicianAccess,
    ) {
      let userId: number;

      if (technicianAccess === 'technician:id:body') {
        userId = Number(request.body.userId);
      }

      if (technicianAccess === 'technician:id:param') {
        userId = Number(request.params.userId);
      }

      if (technicianAccess === 'technician:id:query') {
        userId = Number(request.query.userId);
      }

      if (!userId) {
        throw new UnprocessableEntityException(
          'userId not found neither in body, param or query',
        );
      }

      if (request?.user?.id !== userId) {
        throw new ForbiddenException('different technician data not allowed');
      }

      return true;
    }
  }

  return mixin(RoleGuardClass);
}
