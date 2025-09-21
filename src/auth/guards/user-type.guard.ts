import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  ForbiddenException,
} from '@nestjs/common';

export function UserTypeGuard(required: 'user' | 'stylist'): Type<CanActivate> {
  @Injectable()
  class UTGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const req = ctx
        .switchToHttp()
        .getRequest<{ user?: { userType?: string } }>();

      if (!req.user?.userType) {
        throw new ForbiddenException('User type not found');
      }

      if (req.user.userType !== required) {
        throw new ForbiddenException(
          `Access denied. Required user type: ${required}`,
        );
      }

      return true;
    }
  }
  return UTGuard;
}
