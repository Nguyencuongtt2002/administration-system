import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  @MaxLength(30)
  @ApiProperty({ description: 'TenMenu', example: 'string' })
  TenMenu: string;

  @IsString()
  @MaxLength(20)
  @ApiProperty({ description: 'Link', example: 'string' })
  Link: string;
}
