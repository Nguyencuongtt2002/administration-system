import { Module } from '@nestjs/common';
import { DonhangService } from './donhang.service';
import { DonhangController } from './donhang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donhang } from './entities/donhang.entity';
import { Chitietdonhang } from '@/chitietdonhang/entities/chitietdonhang.entity';
import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import { DonHangGateway } from './donhang.gateway';
import { User } from '@/users/entities/user.entity';
import { NotificationsModule } from '@/notifications/notifications.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import ms from 'ms';

@Module({
  imports: [
    TypeOrmModule.forFeature([Donhang, Chitietdonhang, Sanpham, User]),
    NotificationsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRE')) / 1000,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [DonhangController],
  providers: [DonhangService, DonHangGateway],
})
export class DonhangModule {}
