import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { NUMBER_ZERO } from 'src/utils/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'Email',
      passwordField: 'MatKhau',
    });
  }

  async validate(Email: string, MatKhau: string): Promise<any> {
    // Logic xác thực người dùng ở đây
    // Ví dụ kiểm tra tài khoản và mật khẩu trong cơ sở dữ liệu
    const user = await this.authService.validateUser(Email, MatKhau);
    if (!user) {
      throw new UnauthorizedException('Username/password không hợp lệ!');
    }
    if (user.isActive === NUMBER_ZERO) {
      throw new BadRequestException('Tài khoản chưa được kích hoạt ');
    }
    return user;
  }
}
