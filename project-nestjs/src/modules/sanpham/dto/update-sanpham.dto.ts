import { PartialType } from '@nestjs/swagger';
import { CreateSanphamDto } from './create-sanpham.dto';

export class UpdateSanphamDto extends PartialType(CreateSanphamDto) {}
