import { RefreshTokenService } from '@/refresh-token/refresh-token.service';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateUserDto,
} from '@/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { IUser } from '@/users/users.interface';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { STAFF } from 'src/utils/common';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
    @InjectRepository(User)
    private nguoiDungRepository: Repository<User>,
  ) {
    this.oauth2Client = new google.auth.OAuth2(
      configService.get<string>('GOOGLE_CLIENT_ID'),
      configService.get<string>('GOOGLE_CLIENT_SECRET'),
      configService.get<string>('GOOGLE_REDIRECT_URI'),
    );
  }
  async validateUser(Email: string, MatKhau: string): Promise<any> {
    // Tìm người dùng dựa trên tên đăng nhập bằng TypeORM
    const user = await this.usersService.findOneByUsername(Email);

    if (user) {
      // Kiểm tra mật khẩu
      const isValid = this.usersService.isValidPassword(MatKhau, user.MatKhau);
      if (isValid) {
        const objUser = {
          ...user,
        };

        return objUser;
      }
    }

    return null;
  }

  async login(user: IUser) {
    const payload = {
      TaiKhoan: user.TaiKhoan,
      SoDienThoai: user.SoDienThoai,
      AnhDaiDien: user.AnhDaiDien,
      MaNguoiDung: user.MaNguoiDung,
      Email: user.Email,
      DiaChi: user.DiaChi,
      VaiTro: user.VaiTro,
    };

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    await this.refreshTokenService.saveToken({
      token: refreshToken,
      userId: user.MaNguoiDung,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    return {
      access_token: this.jwtService.sign(payload),
      refreshToken,
      user: {
        Email: user.Email,
        DiaChi: user.DiaChi,
        TaiKhoan: user.TaiKhoan,
        HoTen: user.HoTen,
        AnhDaiDien: user.AnhDaiDien,
        MaNguoiDung: user.MaNguoiDung,
        SoDienThoai: user.SoDienThoai,
        VaiTro: user.VaiTro,
      },
    };
  }

  handleRegister = async (registerDTO: CreateUserDto) => {
    return await this.usersService.handleRegister(registerDTO);
  };

  resendCode = async (body: { MaNguoiDung: number }) => {
    return await this.usersService.resendCode(body);
  };

  checkCode = async (data: CodeAuthDto) => {
    return await this.usersService.handleActive(data);
  };

  retryActive = async (Email: string) => {
    return await this.usersService.retryActive(Email);
  };

  retryPassword = async (Email: string) => {
    return await this.usersService.retryPassword(Email);
  };

  changePassword = async (data: ChangePasswordAuthDto) => {
    return await this.usersService.changePassword(data);
  };

  getGoogleLink() {
    const scope = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ];
    const url = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
    });
    return { url };
  }

  async handleGoogleCallback({ code }: { code: string }) {
    try {
      // 1. Dùng code để lấy access_token từ Google
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);

      // 2. Lấy thông tin người dùng từ Google
      const oauth2 = google.oauth2({
        auth: this.oauth2Client,
        version: 'v2',
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email) {
        throw new BadRequestException('Google account không có email!');
      }

      // 3. Tìm hoặc tạo người dùng từ Google email
      let user = await this.usersService.findOneByUsername(data.email);
      const hashPassword = this.usersService.getHashPassword('123456');

      if (!user) {
        const createUserDto = {
          TaiKhoan: data.email, // hoặc bạn có thể tạo uuid
          MatKhau: hashPassword, // random password (sẽ hash trong service)
          Email: data.email,
          HoTen: data.name || '',
          NgaySinh: null,
          GioiTinh: null,
          DiaChi: '',
          SoDienThoai: '',
          AnhDaiDien: data.picture || null,
          VaiTro: STAFF, //
        };

        user = await this.nguoiDungRepository.save(createUserDto);
      }

      const payload = {
        TaiKhoan: user.TaiKhoan,
        SoDienThoai: user.SoDienThoai,
        AnhDaiDien: user.AnhDaiDien,
        MaNguoiDung: user.MaNguoiDung,
        Email: user.Email,
        DiaChi: user.DiaChi,
        VaiTro: user.VaiTro,
      };

      const refreshToken = this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      });

      await this.refreshTokenService.saveToken({
        token: refreshToken,
        userId: user.MaNguoiDung,
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
      });

      const access_token = this.jwtService.sign(payload);

      return {
        access_token,
        refreshToken,
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async refreshToken({ refreshToken }: { refreshToken: string }) {
    const tokenInDb =
      await this.refreshTokenService.findOneByToken(refreshToken);

    console.log('mmm', tokenInDb);

    if (!tokenInDb) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findOneByUsername(
      tokenInDb.user.Email,
    );

    console.log('kkk', user);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (new Date() > tokenInDb.expiresAt) {
      await this.refreshTokenService.deleteById(tokenInDb.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    const payload = {
      TaiKhoan: user.TaiKhoan,
      SoDienThoai: user.SoDienThoai,
      AnhDaiDien: user.AnhDaiDien,
      MaNguoiDung: user.MaNguoiDung,
      Email: user.Email,
      DiaChi: user.DiaChi,
      VaiTro: user.VaiTro,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRE'),
    });

    const newRefreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    await this.refreshTokenService.deleteById(tokenInDb.id);

    await this.refreshTokenService.saveToken({
      token: newRefreshToken,
      userId: user.MaNguoiDung,
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
    });

    return {
      access_token: accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
