import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';

import { CreateDonhangDto } from './dto/create-donhang.dto';
import { Donhang } from './entities/donhang.entity';
import { Chitietdonhang } from '@/chitietdonhang/entities/chitietdonhang.entity';
import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import { DonHangGateway } from './donhang.gateway';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class DonhangService {
  constructor(
    private readonly donHangGateway: DonHangGateway,
    private readonly dataSource: DataSource,
  ) {}

  async createDonHang(createDonHangDto: CreateDonhangDto) {
    return await this.dataSource.transaction(async (manager) => {
      const donHangRepo = manager.getRepository(Donhang);
      const sanPhamRepo = manager.getRepository(Sanpham);
      const chiTietRepo = manager.getRepository(Chitietdonhang);
      const nguoiDungRepo = manager.getRepository(User);

      // 1. Tạo đơn hàng mới
      const donHang = donHangRepo.create({
        ...createDonHangDto,
        NgayDat: new Date(),
      });

      const savedDonHang = await donHangRepo.save(donHang);

      const chiTietDonHangValues = [];

      // 2. Duyệt từng sản phẩm và khóa ghi
      for (const item of createDonHangDto.chiTietDonHang) {
        const sanPham = await sanPhamRepo
          .createQueryBuilder('sanPham')
          .setLock('pessimistic_write')
          .where('sanPham.MaSanPham = :maSanPham', {
            maSanPham: item.MaSanPham,
          })
          .getOne();

        if (!sanPham) {
          throw new BadRequestException(
            `Sản phẩm với mã ${item.MaSanPham} không tồn tại.`,
          );
        }

        if (sanPham.SoLuong < item.SoLuong) {
          throw new BadRequestException(
            `Sản phẩm với mã ${item.MaSanPham} không đủ số lượng.`,
          );
        }

        // Gom chi tiết đơn hàng để insert hàng loạt
        chiTietDonHangValues.push({
          MaDonHang: savedDonHang.MaDonHang,
          MaSanPham: sanPham.MaSanPham,
          SoLuong: item.SoLuong,
          GiaTien: item.GiaTien,
        });

        // Trừ số lượng tồn kho an toàn
        await sanPhamRepo.decrement(
          { MaSanPham: sanPham.MaSanPham },
          'SoLuong',
          item.SoLuong,
        );
      }

      // 3. Insert tất cả chi tiết đơn hàng cùng lúc
      await chiTietRepo
        .createQueryBuilder()
        .insert()
        .into(Chitietdonhang)
        .values(chiTietDonHangValues)
        .execute();

      // 4. Tìm người dùng đặt hàng
      const nguoiDung = await nguoiDungRepo.findOne({
        where: { MaNguoiDung: savedDonHang.MaNguoiDung },
      });

      if (!nguoiDung) {
        throw new NotFoundException('Người dùng không tồn tại.');
      }

      // 5. Gửi thông báo tới tất cả ADMIN
      const adminUsers = await nguoiDungRepo.find({
        where: { VaiTro: 'ADMIN' },
      });

      for (const admin of adminUsers) {
        await this.donHangGateway.sendOrderNotification({
          senderId: savedDonHang.MaNguoiDung,
          receiverId: admin.MaNguoiDung,
          content: `Người dùng ${nguoiDung.HoTen} đã đặt đơn hàng #${savedDonHang.MaDonHang}.`,
        });
      }

      return savedDonHang;
    });
  }
}
