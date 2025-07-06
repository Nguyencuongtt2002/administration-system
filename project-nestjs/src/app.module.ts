import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SanphamModule } from '@/sanpham/sanpham.module';
import { ThuonghieuModule } from '@/thuonghieu/thuonghieu.module';
import { LoaisanphamModule } from '@/loaisanpham/loaisanpham.module';
import { MenuModule } from '@/menu/menu.module';
import { LienheModule } from '@/lienhe/lienhe.module';
import { GiamgiaModule } from '@/giamgia/giamgia.module';
import { SizeModule } from '@/size/size.module';
import { FilesModule } from '@/files/files.module';
import { GioithieuModule } from '@/gioithieu/gioithieu.module';
import { SlideModule } from '@/slide/slide.module';
import { GiaModule } from '@/gia/gia.module';
import { DonhangModule } from '@/donhang/donhang.module';
import { ChitietdonhangModule } from '@/chitietdonhang/chitietdonhang.module';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { NhacungcapModule } from '@/nhacungcap/nhacungcap.module';
import { ThongkeModule } from '@/thongke/thongke.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MessageModule } from './modules/message/message.module';
import { RefreshTokenModule } from './modules/refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) =>
        ({
          type: 'mysql',
          host: configService.get<string>('HOST'),
          port: +configService.get<string>('PORT'),
          username: configService.get<string>('USER'),
          database: configService.get<string>('DATABASE'),
          entities: [__dirname + '/**/*.entity.{ts,js}'],
          synchronize: true,
        }) as TypeOrmModuleOptions,
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: '"No Reply" <no-reply@localhost>',
        },
        //preview: true,
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    SanphamModule,
    ThuonghieuModule,
    LoaisanphamModule,
    MenuModule,
    LienheModule,
    GiamgiaModule,
    SizeModule,
    FilesModule,
    GioithieuModule,
    SlideModule,
    GiaModule,
    DonhangModule,
    ChitietdonhangModule,
    AuthModule,
    UsersModule,
    NhacungcapModule,
    ThongkeModule,
    NotificationsModule,
    MessageModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
