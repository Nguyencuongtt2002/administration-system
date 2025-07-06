import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsPositive } from 'class-validator';

export class CreateGiamgiaDto {
  @ApiProperty({
    description: 'MaSanPham',
    example: 1,
  })
  @IsInt()
  @IsPositive()
  MaSanPham: number;

  @ApiProperty({
    description: 'PhanTram',
    example: 30,
  })
  @IsInt()
  @IsPositive()
  PhanTram: number;

  @ApiProperty({
    description: 'NgayBD',
  })
  @IsDate()
  NgayBD: Date;

  @ApiProperty({
    description: 'NgayKT',
  })
  @IsDate()
  NgayKT: Date;
}
