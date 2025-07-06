import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateLoaisanphamDto } from './create-loaisanpham.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateLoaisanphamDto extends PartialType(CreateLoaisanphamDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaLoaiSanPham', example: 1 })
  MaLoaiSanPham: number;
}
