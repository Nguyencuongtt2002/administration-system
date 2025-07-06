import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateSlideDto } from './create-slide.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSlideDto extends PartialType(CreateSlideDto) {
  @IsNotEmpty()
  @ApiProperty({ description: 'MaSlide', example: 1 })
  MaSlide: number;
}
