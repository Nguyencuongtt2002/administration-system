import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThuongHieu } from './entities/thuonghieu.entity';
import aqp from 'api-query-params';
import { CreateThuonghieuDto } from './dto/create-thuonghieu.dto';
import { UpdateThuonghieuDto } from './dto/update-thuonghieu.dto';

@Injectable()
export class ThuonghieuService {
  constructor(
    @InjectRepository(ThuongHieu)
    private thuongHieuRepository: Repository<ThuongHieu>,
  ) {}

  async create(createThuonghieuDto: CreateThuonghieuDto) {
    const newCategory = this.thuongHieuRepository.create(createThuonghieuDto);
    return await this.thuongHieuRepository.save(newCategory);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);

    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;

    const totalItems = await this.thuongHieuRepository.count({
      where: { ...filter, deletedAt: null },
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.thuongHieuRepository.find({
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

  async findOne(id: number): Promise<ThuongHieu | undefined> {
    const thuonghieu = await this.thuongHieuRepository.findOne({
      where: {
        MaThuongHieu: id,
      },
    });
    return thuonghieu;
  }

  async update(updateThuonghieuDto: UpdateThuonghieuDto) {
    const res = await this.thuongHieuRepository
      .createQueryBuilder()
      .update(ThuongHieu)
      .set({
        TenThuongHieu: updateThuonghieuDto.TenThuongHieu,
        GioiThieu: updateThuonghieuDto.GioiThieu,
      })
      .where('MaThuongHieu = :MaThuongHieu', {
        MaThuongHieu: updateThuonghieuDto.MaThuongHieu,
      })
      .execute();
    return res;
  }

  async remove(MaThuongHieu: number) {
    await this.thuongHieuRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaThuongHieu = :MaThuongHieu', { MaThuongHieu })
      .execute();
  }

  async restore(MaThuongHieu: number) {
    await this.thuongHieuRepository
      .createQueryBuilder()
      .restore()
      .where('MaThuongHieu = :MaThuongHieu', { MaThuongHieu })
      .execute();
  }
}
