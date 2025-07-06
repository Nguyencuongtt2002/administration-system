import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';
import { Request } from 'express';
import { ADMIN, API_AUTH, EMPTY_STRING, STAFF } from 'src/utils/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();

    const isSkipPermission = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_PERMISSION,
      [context.getHandler(), context.getClass()],
    );
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Token không hợp lệ or không có token ở Bearer Token ở Header request!',
        )
      );
    }

    // Check permissions
    const targetMethod = request.method;
    const targetEndpoint = request.route?.path ?? ''; // Đảm bảo targetEndpoint luôn là chuỗi
    const userRole = user?.VaiTro || EMPTY_STRING; // Đặt giá trị mặc định nếu VaiTro không tồn tại
    let isExist = userRole === ADMIN || userRole === STAFF;

    // Kiểm tra quyền
    // const hasPermission =
    //   userRole === ADMIN ||
    //   userRole === NHAN_VIEN ||
    //   targetEndpoint.startsWith(API_AUTH);

    if (targetEndpoint.startsWith('/api/v1/auth')) isExist = true;

    if (!isExist && !isSkipPermission) {
      throw new ForbiddenException(
        'Bạn không có quyền để truy cập endpoint này!',
      );
    }

    return user;
  }
}
