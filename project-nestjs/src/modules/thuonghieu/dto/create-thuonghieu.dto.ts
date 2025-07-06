import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateThuonghieuDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @ApiProperty({ description: 'TenThuongHieu', example: 'string' })
  TenThuongHieu: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'GioiThieu', example: 'string' })
  GioiThieu: string;
}
