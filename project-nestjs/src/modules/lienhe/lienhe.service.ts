import { Injectable } from '@nestjs/common';
import { CreateLienheDto } from './dto/create-lienhe.dto';
import { UpdateLienheDto } from './dto/update-lienhe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lienhe } from './entities/lienhe.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class LienheService {
  constructor(
    @InjectRepository(Lienhe)
    private lienHeRepository: Repository<Lienhe>,
  ) {}

  async create(createLienheDto: CreateLienheDto) {
    const newLienHe = this.lienHeRepository.create(createLienheDto);
    return await this.lienHeRepository.save(newLienHe);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.lienHeRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.lienHeRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort as any,
    });
    // Trả về kết quả
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: number) {
    const res = await this.lienHeRepository.findOne({
      where: {
        MaLienHe: id,
      },
    });
    return res;
  }

  async update(updateLienheDto: UpdateLienheDto) {
    const res = await this.lienHeRepository
      .createQueryBuilder()
      .update(Lienhe)
      .set({
        Email: updateLienheDto.Email,
        DiaChi: updateLienheDto.DiaChi,
        SoDienThoai: updateLienheDto.SoDienThoai,
      })
      .where('MaLienHe = :MaLienHe ', {
        MaLienHe: updateLienheDto.MaLienHe,
      })
      .execute();
    return res;
  }

  async remove(MaLienHe: number) {
    await this.lienHeRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaLienHe = :MaLienHe', { MaLienHe })
      .execute();
  }

  async restore(MaLienHe: number) {
    await this.lienHeRepository
      .createQueryBuilder()
      .restore()
      .where('MaLienHe = :MaLienHe', { MaLienHe })
      .execute();
  }
}
