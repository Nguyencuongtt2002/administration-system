import { PartialType } from '@nestjs/swagger';
import { CreateThongkeDto } from './create-thongke.dto';

export class UpdateThongkeDto extends PartialType(CreateThongkeDto) {}
