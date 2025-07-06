import { Injectable } from '@nestjs/common';
import { CreateChitietdonhangDto } from './dto/create-chitietdonhang.dto';
import { UpdateChitietdonhangDto } from './dto/update-chitietdonhang.dto';

@Injectable()
export class ChitietdonhangService {
  create(createChitietdonhangDto: CreateChitietdonhangDto) {
    return 'This action adds a new chitietdonhang';
  }

  findAll() {
    return `This action returns all chitietdonhang`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chitietdonhang`;
  }

  update(id: number, updateChitietdonhangDto: UpdateChitietdonhangDto) {
    return `This action updates a #${id} chitietdonhang`;
  }

  remove(id: number) {
    return `This action removes a #${id} chitietdonhang`;
  }
}
