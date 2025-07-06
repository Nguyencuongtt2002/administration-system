import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordAuthDto,
  CodeAuthDto,
  CreateUserDto,
  UserLoginDto,
} from '@/users/dto/create-user.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import {
  RefreshTokenDto,
  TokenResponseDto,
} from '@/refresh-token/dto/create-refresh-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: UserLoginDto })
  @Public()
  @Post('/login')
  @ResponseMessage('User Login')
  handleLogin(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('mail')
  @Public()
  testMail() {
    this.mailerService.sendMail({
      to: 'cuongtt1407@gmail.com',
      subject: 'Testing Nest MailerModule ✔',
      text: 'welcome',
      template: 'register',
      context: {
        name: 'eric',
        activationCode: 123,
      },
    });
    return 'ok';
  }

  @Post('register')
  @Public()
  register(@Body() registerDTO: CreateUserDto) {
    return this.authService.handleRegister(registerDTO);
  }

  @Post('check-code')
  @Public()
  checkCode(@Body() registerDTO: CodeAuthDto) {
    return this.authService.checkCode(registerDTO);
  }

  @Post('resend-code')
  @Public()
  async resendCode(@Body() body: { MaNguoiDung: number }) {
    return this.authService.resendCode(body);
  }

  @Post('retry-active')
  @ApiBody({
    description: 'Email',
    type: String, // Specify that the body is expected to be a string
  })
  @Public()
  retryActive(@Body('Email') Email: string) {
    // Directly bind the body to Email
    return this.authService.retryActive(Email);
  }

  @Post('retry-password')
  @Public()
  retryPassword(@Body('Email') Email: string) {
    // Directly bind the body to Email
    return this.authService.retryPassword(Email);
  }

  @Post('change-password')
  @Public()
  changePassword(@Body() data: ChangePasswordAuthDto) {
    return this.authService.changePassword(data);
  }

  @Get('google-link')
  @Public()
  getGoogleLink() {
    return this.authService.getGoogleLink();
  }

  @Get('google/callback')
  @Public()
  async handleGoogleCallback(
    @Query('code') code: string,
    @Res() res: Response,
  ) {
    const data = await this.authService.handleGoogleCallback({
      code,
    });
    return res.redirect(
      `${this.configService.get<string>('GOOGLE_CLIENT_REDIRECT_URI')}?accessToken=${data.access_token}&refreshToken=${data.refreshToken}`,
    );
  }

  @Post('refresh-token')
  @Public()
  refreshToken(@Body() body: RefreshTokenDto) {
    console.log(body.refreshToken);

    return this.authService.refreshToken({
      refreshToken: body.refreshToken,
    });
  }
}
