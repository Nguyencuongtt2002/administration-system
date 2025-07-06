import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'TaiKhoan',
    example: 'string',
    maxLength: 35,
  })
  @IsString()
  @Length(1, 35)
  TaiKhoan: string;

  @ApiProperty({ description: 'MatKhau', type: String })
  @IsString()
  MatKhau: string;

  @ApiProperty({ description: 'Email', maxLength: 50 })
  @IsEmail()
  @Length(1, 50)
  Email: string;

  @ApiProperty({ description: 'HoTen', maxLength: 50 })
  @IsString()
  @Length(1, 50)
  HoTen: string;

  @ApiProperty({ description: 'NgaySinh' })
  NgaySinh: Date;

  @ApiProperty({ description: 'GioiTinh', maxLength: 10 })
  GioiTinh: string;

  @ApiProperty({ description: 'DiaChi', maxLength: 50 })
  DiaChi: string;

  @ApiProperty({ description: 'SoDienThoai', maxLength: 10 })
  SoDienThoai: string;

  @ApiProperty({ description: 'AnhDaiDien', maxLength: 100 })
  AnhDaiDien: string;

  @ApiProperty({ description: 'VaiTro', maxLength: 30 })
  VaiTro: string;

  @ApiProperty({ description: 'isActive' })
  isActive: number;

  @ApiProperty({ description: 'codeId' })
  codeId: string;

  @ApiProperty({ description: 'codeExpired' })
  codeExpired: Date;
}

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'cuongtt1407@gmail.com', description: 'Email' })
  readonly TaiKhoan: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'MatKhau',
  })
  readonly MatKhau: string;
}

export class CodeAuthDto {
  @IsNotEmpty({ message: 'Mã Người dùng không được để trống' })
  MaNguoiDung: number;
  @IsNotEmpty({ message: 'Code không được để trống' })
  code: string;
}

export class ChangePasswordAuthDto {
  @IsNotEmpty({ message: "code không được để trống" })
  code: string;

  @IsNotEmpty({ message: "password không được để trống" })
  password: string;

  @IsNotEmpty({ message: "confirmPassword không được để trống" })
  confirmPassword: string;

  @IsNotEmpty({ message: "email không được để trống" })
  email: string;

}
