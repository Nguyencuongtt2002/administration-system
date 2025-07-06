import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSizeDto } from './create-size.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSizeDto extends PartialType(CreateSizeDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaSize', example: 1 })
  MaSize: number;
}
