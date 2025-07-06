import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSanphamDto {
  @IsString()
  @ApiProperty({ description: 'TenSP', example: 'string' })
  TenSP: string;

  @IsString()
  @ApiProperty({ description: 'MoTa', example: 'string' })
  MoTa: string;

  @IsDate()
  @ApiProperty({ description: 'NgayTao' })
  NgayTao: Date;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'MaLoaiSanPham', example: 1 })
  MaLoaiSanPham?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'MaThuongHieu', example: 1 })
  MaThuongHieu?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ description: 'MaSize', example: 1 })
  MaSize?: number;

  @IsNumber()
  @ApiProperty({ description: 'SoLuong', example: 1 })
  SoLuong: number;

  @IsOptional()
  @ApiProperty({
    description: 'AnhDaiDien',
    example: 'string',
  })
  AnhDaiDien: string;
}
