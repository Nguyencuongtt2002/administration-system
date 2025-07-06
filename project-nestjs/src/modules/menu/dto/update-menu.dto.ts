import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMenuDto } from './create-menu.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaMenu', example: 1 })
  MaMenu: number;
}
