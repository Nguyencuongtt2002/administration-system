import { PartialType } from '@nestjs/swagger';
import { CreateGiaDto } from './create-gia.dto';

export class UpdateGiaDto extends PartialType(CreateGiaDto) {}
