import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLoaisanphamDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'TenLoaiSanPham', example: 'áo thun' })
  TenLoaiSanPham: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'GioiThieu', example: 'đẹp' })
  GioiThieu: string;
}
