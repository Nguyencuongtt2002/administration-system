import { CreateChitietdonhangDto } from '@/chitietdonhang/dto/create-chitietdonhang.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNumber, IsString, ValidateNested } from 'class-validator';

export class CreateDonhangDto {
  @ApiProperty({
    description: 'NgayDat',
    example: '2024-12-09T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  NgayDat: Date;

  @ApiProperty({
    description: 'NgayGiao',
    example: '2024-12-10T00:00:00.000Z',
  })
  @IsDate()
  @Type(() => Date)
  NgayGiao: Date;

  @ApiProperty({
    description: 'HoTen',
    example: 'Nguyễn Văn A',
  })
  @IsString()
  HoTen: string;

  @ApiProperty({
    description: 'DiaChi',
    example: 'Số 123, đường ABC, TP. HCM',
  })
  @IsString()
  DiaChi: string;

  @ApiProperty({
    description: 'SoDienThoai',
    example: '0901234567',
  })
  @IsString()
  SoDienThoai: string;

  @ApiProperty({
    description: 'PhuongThucThanhToan',
    example: 'Thanh toán khi nhận hàng',
  })
  @IsString()
  PhuongThucThanhToan: string;

  @ApiProperty({
    description: 'MaNguoiDung',
    example: 1,
  })
  @IsNumber()
  MaNguoiDung: number;

  @ApiProperty({
    description: 'TinhTrang',
    example: 1,
  })
  @IsNumber()
  TinhTrang: number;

  @ApiProperty({
    description: 'chiTietDonHang',
    type: [CreateChitietdonhangDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateChitietdonhangDto)
  chiTietDonHang: CreateChitietdonhangDto[];
}
