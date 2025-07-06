import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';

export class CreateLienheDto {
  @ApiProperty({
    description: 'Email',
    example: 'example@gmail.com',
  })
  @IsEmail()
  @MaxLength(30)
  Email: string;

  @ApiProperty({
    description: 'DiaChi',
    example: '123 Đường ABC, Quận 1, TP.HCM',
  })
  @IsString()
  DiaChi: string;

  @ApiProperty({ description: 'SoDienThoai', example: '0123456789' })
  @IsString()
  @MaxLength(15)
  SoDienThoai: string;
}
