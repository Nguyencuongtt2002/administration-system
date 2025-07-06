import { Injectable } from '@nestjs/common';
import { CreateGiamgiaDto } from './dto/create-giamgia.dto';
import { UpdateGiamgiaDto } from './dto/update-giamgia.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Giamgia } from './entities/giamgia.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class GiamgiaService {
  constructor(
    @InjectRepository(Giamgia)
    private giamGiaRepository: Repository<Giamgia>,
  ) {}

  async create(createGiamgiaDto: CreateGiamgiaDto) {
    const giamgia = this.giamGiaRepository.create(createGiamgiaDto);
    return await this.giamGiaRepository.save(giamgia);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.giamGiaRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.giamGiaRepository.find({
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
    const res = await this.giamGiaRepository.findOne({
      where: {
        MaGiamGia: id,
      },
    });
    return res;
  }

  async update(updateGiamgiaDto: UpdateGiamgiaDto) {
    const res = await this.giamGiaRepository
      .createQueryBuilder()
      .update(Giamgia)
      .set({
        MaSanPham: updateGiamgiaDto.MaSanPham,
        PhanTram: updateGiamgiaDto.PhanTram,
        NgayBD: updateGiamgiaDto.NgayBD,
        NgayKT: updateGiamgiaDto.NgayKT,
      })
      .where('MaGiamGia = :MaGiamGia ', {
        MaGiamGia: updateGiamgiaDto.MaGiamGia,
      })
      .execute();
    return res;
  }

  async remove(MaGiamGia: number) {
    await this.giamGiaRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaGiamGia = :MaGiamGia', { MaGiamGia })
      .execute();
  }

  async restore(MaGiamGia: number) {
    await this.giamGiaRepository
      .createQueryBuilder()
      .restore()
      .where('MaGiamGia = :MaGiamGia', { MaGiamGia })
      .execute();
  }
}
