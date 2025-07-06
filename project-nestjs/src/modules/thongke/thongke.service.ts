import { Injectable } from '@nestjs/common';
import { CreateThongkeDto } from './dto/create-thongke.dto';
import { UpdateThongkeDto } from './dto/update-thongke.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Donhang } from '@/donhang/entities/donhang.entity';
import { Repository } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { Sanpham } from '@/sanpham/entities/sanpham.entity';

@Injectable()
export class ThongkeService {
  constructor(
      @InjectRepository(Donhang)
      private donHangRepository: Repository<Donhang>,
      @InjectRepository(User)
      private nguoiDungRepository: Repository<User>,
      @InjectRepository(Sanpham)
      private sanPhamRepository: Repository<Sanpham>,
    ) {}
  create(createThongkeDto: CreateThongkeDto) {
    return 'This action adds a new thongke';
  }

  async thongKeTongSoLuong(): Promise<{ TongSanPham: number, TongNguoiDung: number, TongDoanhThu: number }> {
    const tongSanPham = await this.sanPhamRepository.count();

    const tongNguoiDung = await this.nguoiDungRepository.count();

    const tongDoanhThu = await this.donHangRepository
      .createQueryBuilder('dh')
      .innerJoinAndSelect('dh.chiTietDonHang', 'ctdh')
      .where('dh.TinhTrang = :tinhTrang', { tinhTrang: 6 }) 
      .select('SUM(ctdh.SoLuong * ctdh.GiaTien)', 'tongDoanhThu')
      .getRawOne();

    return {
      TongSanPham: tongSanPham || 0,
      TongNguoiDung: tongNguoiDung || 0,
      TongDoanhThu: tongDoanhThu?.tongDoanhThu || 0,
    };
  }

  findAll() {
    return `This action returns all thongke`;
  }

  findOne(id: number) {
    return `This action returns a #${id} thongke`;
  }

  update(id: number, updateThongkeDto: UpdateThongkeDto) {
    return `This action updates a #${id} thongke`; 
  }

  remove(id: number) {
    return `This action removes a #${id} thongke`;
  }
}
