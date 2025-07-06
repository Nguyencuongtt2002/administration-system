import { PartialType } from '@nestjs/swagger';
import { CreateChitietdonhangDto } from './create-chitietdonhang.dto';

export class UpdateChitietdonhangDto extends PartialType(CreateChitietdonhangDto) {}
