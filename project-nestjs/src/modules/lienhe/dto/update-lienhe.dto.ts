import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLienheDto } from './create-lienhe.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateLienheDto extends PartialType(CreateLienheDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaLienHe', example: 1 })
  MaLienHe: number;
}
