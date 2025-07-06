import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGiamgiaDto } from './create-giamgia.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateGiamgiaDto extends PartialType(CreateGiamgiaDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaGiamGia', example: 1 })
  MaGiamGia: number;
}
