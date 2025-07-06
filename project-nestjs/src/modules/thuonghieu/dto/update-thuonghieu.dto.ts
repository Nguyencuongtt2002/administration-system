import { CreateThuonghieuDto } from './create-thuonghieu.dto';
import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateThuonghieuDto extends PartialType(CreateThuonghieuDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaThuongHieu', example: 1 })
  MaThuongHieu: number;
}
