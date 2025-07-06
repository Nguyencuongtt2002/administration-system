import { PartialType } from '@nestjs/swagger';
import { CreateDonhangDto } from './create-donhang.dto';

export class UpdateDonhangDto extends PartialType(CreateDonhangDto) {}
