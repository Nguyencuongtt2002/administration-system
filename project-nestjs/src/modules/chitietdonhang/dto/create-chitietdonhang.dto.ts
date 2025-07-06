import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class CreateChitietdonhangDto {

  @ApiProperty({
    description: 'Mã sản phẩm',
    example: 202,
  })
  @IsInt()
  MaSanPham: number;

  @ApiProperty({
    description: 'Số lượng sản phẩm',
    example: 2,
  })
  @IsNumber()
  SoLuong: number;

  @ApiProperty({
    description: 'Giá tiền sản phẩm',
    example: 100000,
  })
  @IsNumber()
  GiaTien: number;

  @ApiProperty({
    description: 'Ngày xóa (nếu có)',
    example: '2024-12-09T00:00:00Z',
    required: false,
  })
  @IsOptional()
  deletedAt?: Date;
}
