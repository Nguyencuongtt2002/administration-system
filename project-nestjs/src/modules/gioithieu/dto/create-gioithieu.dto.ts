import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateGioithieuDto {
  @IsString()
  @ApiProperty({ description: 'TieuDe', example: 'string' })
  TieuDe: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'NoiDung', example: 'string' })
  NoiDung: string;

  @IsOptional()
  @ApiProperty({
    description: 'HinhAnh',
    example: 'string',
  })
  HinhAnh?: string;
}
