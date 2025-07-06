import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNhacungcapDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'TenNhaCungCap', example: 'string' })
  TenNhaCungCap: string;
  @IsString()
  @ApiProperty({ description: 'DiaChi', example: 'string' })
  DiaChi: string;
  @IsString()
  @ApiProperty({ description: 'SoDienThoai', example: 'string' })
  SoDienThoai: string;
  @IsString()
  @ApiProperty({ description: 'Email', example: 'string' })
  Email: string;
}
