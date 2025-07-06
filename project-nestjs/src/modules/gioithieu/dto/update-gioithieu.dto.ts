import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateGioithieuDto } from './create-gioithieu.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateGioithieuDto extends PartialType(CreateGioithieuDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaGioiThieu', example: 1 })
  MaGioiThieu: number;
}
