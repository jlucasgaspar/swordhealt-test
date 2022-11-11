import { createParamDecorator, ExecutionContext } from '@nestjs/common';

function getUser(_: unknown, ctx: ExecutionContext) {
  return ctx.switchToHttp().getRequest().user;
}

export const User = createParamDecorator(getUser);
