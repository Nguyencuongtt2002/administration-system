import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateNhacungcapDto } from './create-nhacungcap.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateNhacungcapDto extends PartialType(CreateNhacungcapDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaNhaCungCap', example: 1 })
  MaNhaCungCap: number;
}
