import { Injectable } from '@nestjs/common';
import { CreateNhacungcapDto } from './dto/create-nhacungcap.dto';
import { UpdateNhacungcapDto } from './dto/update-nhacungcap.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Nhacungcap } from './entities/nhacungcap.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class NhacungcapService {
  constructor(
    @InjectRepository(Nhacungcap)
    private nhaCungCapRepository: Repository<Nhacungcap>,
  ) {}

  async create(createNhacungcapDto: CreateNhacungcapDto) {
    const newNCC = this.nhaCungCapRepository.create(createNhacungcapDto);
    return await this.nhaCungCapRepository.save(newNCC);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.nhaCungCapRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.nhaCungCapRepository.find({
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
    const res = await this.nhaCungCapRepository
      .createQueryBuilder('ncc')
      .where('ncc.MaNhaCungCap = :id', { id })
      .getOne();

    return res;
  }

  async update(updateNhacungcapDto: UpdateNhacungcapDto) {
    const res = await this.nhaCungCapRepository
      .createQueryBuilder()
      .update(Nhacungcap)
      .set({
        TenNhaCungCap: updateNhacungcapDto.TenNhaCungCap,
        DiaChi: updateNhacungcapDto.DiaChi,
        SoDienThoai: updateNhacungcapDto.SoDienThoai,
        Email: updateNhacungcapDto.Email,
      })
      .where('MaNhaCungCap = :MaNhaCungCap ', {
        MaNhaCungCap: updateNhacungcapDto.MaNhaCungCap,
      })
      .execute();
    return res;
  }

  async remove(MaNhaCungCap: number) {
    await this.nhaCungCapRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaNhaCungCap = :MaNhaCungCap', { MaNhaCungCap })
      .execute();
  }

  async restore(MaNhaCungCap: number) {
    await this.nhaCungCapRepository
      .createQueryBuilder()
      .restore()
      .where('MaNhaCungCap = :MaNhaCungCap', { MaNhaCungCap })
      .execute();
  }
}
