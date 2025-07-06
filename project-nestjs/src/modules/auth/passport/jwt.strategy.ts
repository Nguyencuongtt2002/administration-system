import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUser } from '@/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: IUser) {
    const {
      TaiKhoan,
      SoDienThoai,
      AnhDaiDien,
      MaNguoiDung,
      Email,
      DiaChi,
      VaiTro,
    } = payload;

    return {
      TaiKhoan,
      SoDienThoai,
      AnhDaiDien,
      MaNguoiDung,
      Email,
      DiaChi,
      VaiTro,
    };
  }
}
