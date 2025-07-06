import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private sizeRepository: Repository<Size>,
  ) {}
  async create(createSizeDto: CreateSizeDto) {
    const size = this.sizeRepository.create(createSizeDto);
    return await this.sizeRepository.save(size);
  }
  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.sizeRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.sizeRepository.find({
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
  async findOne(id: number): Promise<Size | undefined> {
    const res = await this.sizeRepository.findOne({
      where: {
        MaSize: id,
      },
    });
    return res;
  }
  async update(updateSizeDto: UpdateSizeDto) {
    const res = await this.sizeRepository
      .createQueryBuilder()
      .update(Size)
      .set({
        TenSize: updateSizeDto.TenSize,
        MoTa: updateSizeDto.MoTa,
      })
      .where('MaSize = :MaSize', {
        MaSize: updateSizeDto.MaSize,
      })
      .execute();
    return res;
  }
  async remove(MaSize: number) {
    await this.sizeRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaSize = :MaSize', { MaSize })
      .execute();
  }

  async restore(MaSize: number) {
    await this.sizeRepository
      .createQueryBuilder()
      .restore()
      .where('MaSize = :MaSize', { MaSize })
      .execute();
  }
}
