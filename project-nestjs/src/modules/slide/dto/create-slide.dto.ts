import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class CreateSlideDto {
  @IsOptional()
  @ApiProperty({
    description: 'Anh',
    example: 'string',
  })
  Anh?: string;
}
