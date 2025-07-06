import { Injectable } from '@nestjs/common';
import { CreateGioithieuDto } from './dto/create-gioithieu.dto';
import { UpdateGioithieuDto } from './dto/update-gioithieu.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Gioithieu } from './entities/gioithieu.entity';
import { EntityManager, Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class GioithieuService {
  constructor(
    @InjectRepository(Gioithieu)
    private gioiThieuRepository: Repository<Gioithieu>,
  ) {}

  async create(createGioithieuDto: CreateGioithieuDto) {
    const gioithieu = this.gioiThieuRepository.create(createGioithieuDto);
    return await this.gioiThieuRepository.save(gioithieu);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.gioiThieuRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.gioiThieuRepository.find({
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
    const res = await this.gioiThieuRepository.findOne({
      where: {
        MaGioiThieu: id,
      },
    });
    return res;
  }

  async update(updateGioithieuDto: UpdateGioithieuDto) {
    const res = await this.gioiThieuRepository
      .createQueryBuilder()
      .update(Gioithieu)
      .set({
        ...updateGioithieuDto,
      })
      .where('MaGioiThieu = :MaGioiThieu', {
        MaGioiThieu: updateGioithieuDto.MaGioiThieu,
      })
      .execute();
    return res;
  }

  async remove(id: number) {
    await this.gioiThieuRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaGioiThieu = :id', { id }) 
      .execute();
  }

  async restore(MaGioiThieu: number) {
    await this.gioiThieuRepository
      .createQueryBuilder()
      .restore()
      .where('MaGioiThieu = :MaGioiThieu', { MaGioiThieu })
      .execute();
  }
}
