import { Injectable } from '@nestjs/common';
import { CreateGiaDto } from './dto/create-gia.dto';
import { UpdateGiaDto } from './dto/update-gia.dto';

@Injectable()
export class GiaService {
  create(createGiaDto: CreateGiaDto) {
    return 'This action adds a new gia';
  }

  findAll() {
    return `This action returns all gia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gia`;
  }

  update(id: number, updateGiaDto: UpdateGiaDto) {
    return `This action updates a #${id} gia`;
  }

  remove(id: number) {
    return `This action removes a #${id} gia`;
  }
}
