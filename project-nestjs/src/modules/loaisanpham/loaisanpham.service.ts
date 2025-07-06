import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Loaisanpham } from './entities/loaisanpham.entity';
import { CreateLoaisanphamDto } from './dto/create-loaisanpham.dto';
import { UpdateLoaisanphamDto } from './dto/update-loaisanpham.dto';

@Injectable()
export class LoaisanphamService {
  constructor(
    @InjectRepository(Loaisanpham)
    private loaisanphamRepository: Repository<Loaisanpham>,
  ) {}
  async create(createLoaiSanPhamDto: CreateLoaisanphamDto) {
    const newCategory = this.loaisanphamRepository.create(createLoaiSanPhamDto);
    return await this.loaisanphamRepository.save(newCategory);
  }
  async findAll(currentPage: number, limit: number, searchKey: string, sortBy: string, sortOrder: 'ASC' | 'DESC') {
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
  
    const filter: any = {};
    if (searchKey) {
      filter.TenLoaiSanPham = Like(`%${searchKey}%`); 
    }
  
    // Đếm tổng số bản ghi
    const totalItems = await this.loaisanphamRepository.count({
      where: filter,
    });
  
    // Tính tổng số trang
    const totalPages = Math.ceil(totalItems / defaultLimit);
  
    // Lấy danh sách kết quả, sắp xếp theo trường và thứ tự được truyền vào
    const result = await this.loaisanphamRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: {
        [sortBy]: sortOrder, // Sắp xếp theo trường và thứ tự bạn truyền vào
      },
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
  
  async findOne(id: number): Promise<Loaisanpham | undefined> {
    const loaiSanPham = await this.loaisanphamRepository
      .createQueryBuilder('loaisanpham')
      .where('loaisanpham.MaLoaiSanPham = :id', { id: id })
      .getOne();

    return loaiSanPham;
  }
  async update(updateLoaiSanPhamDto: UpdateLoaisanphamDto) {
    const res = await this.loaisanphamRepository
      .createQueryBuilder()
      .update(Loaisanpham)
      .set({
        TenLoaiSanPham: updateLoaiSanPhamDto.TenLoaiSanPham,
        GioiThieu: updateLoaiSanPhamDto.GioiThieu,
      })
      .where('MaLoaiSanPham = :MaLoaiSanPham', {
        MaLoaiSanPham: updateLoaiSanPhamDto.MaLoaiSanPham,
      })
      .execute();
    return res;
  }
  async remove(MaLoaiSanPham: number) {
    await this.loaisanphamRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaLoaiSanPham = :MaLoaiSanPham', { MaLoaiSanPham })
      .execute();
  }

  async restore(MaLoaiSanPham: number) {
    await this.loaisanphamRepository
      .createQueryBuilder()
      .restore()
      .where('MaLoaiSanPham = :MaLoaiSanPham', { MaLoaiSanPham })
      .execute();
  }
}
