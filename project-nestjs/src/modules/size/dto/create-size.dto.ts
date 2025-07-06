import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSizeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @ApiProperty({ description: 'TenSize', example: 'string' })
  TenSize: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @ApiProperty({ description: 'MoTa', example: 'string' })
  MoTa: string;
}
