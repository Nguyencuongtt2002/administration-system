import { Injectable } from '@nestjs/common';
import { CreateSanphamDto } from './dto/create-sanpham.dto';
import { UpdateSanphamDto } from './dto/update-sanpham.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Sanpham } from './entities/sanpham.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class SanphamService {
  constructor(
    @InjectRepository(Sanpham)
    private sanphamRepository: Repository<Sanpham>,
  ) {}

  async create(createSanphamDto: CreateSanphamDto) {
    const sanpham = this.sanphamRepository.create(createSanphamDto);
    return await this.sanphamRepository.save(sanpham);
  }

  findAll() {
    return `This action returns all sanpham`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sanpham`;
  }

  update(id: number, updateSanphamDto: UpdateSanphamDto) {
    return `This action updates a #${id} sanpham`;
  }

  remove(id: number) {
    return `This action removes a #${id} sanpham`;
  }

  async getSanPhamMoi(p_SoLuong: number) {
    const query = this.sanphamRepository
      .createQueryBuilder('s')
      .select([
        's.MaSanPham as MaSanPham',
        's.TenSP as TenSP',
        's.AnhDaiDien as AnhDaiDien',
        's.MaSize as MaSize',
        's.MoTa as MoTa',
        'g.DonGia as DonGia',
        'gg.PhanTram as PhanTram',
        'CAST((g.DonGia - (g.DonGia / 100 * gg.PhanTram)) AS SIGNED) AS GiaMoiKhiGiam',
      ])
      .addSelect('l.TenLoaiSanPham', 'TenLoaiSanPham')
      .addSelect('t.TenThuongHieu', 'TenThuongHieu')
      .addSelect('sz.TenSize', 'TenSize')
      .innerJoin('s.loaisanpham', 'l', 's.MaLoaiSanPham = l.MaLoaiSanPham')
      .innerJoin('s.thuonghieu', 't', 's.MaThuongHieu = t.MaThuongHieu')
      .leftJoin('s.gia', 'g', 'g.MaSanPham = s.MaSanPham')
      .innerJoin('s.size', 'sz', 's.MaSize = sz.MaSize')
      .leftJoin('s.giamgia', 'gg', 'gg.MaSanPham = s.MaSanPham')
      .where('s.SoLuong != 0')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(gg.PhanTram IS NOT NULL AND NOW() BETWEEN gg.NgayBD AND gg.NgayKT)',
          )
            .orWhere(
              '(gg.PhanTram IS NULL AND NOW() BETWEEN g.NgayBD AND g.NgayKT)',
            )
            .orWhere(
              '(NOW() BETWEEN g.NgayBD AND g.NgayKT AND gg.PhanTram IS NULL)',
            );
        }),
      )
      .groupBy(
        's.MaSanPham, s.TenSP, s.MaSize, s.AnhDaiDien, s.MoTa, g.DonGia, gg.PhanTram',
      )
      .orderBy('s.NgayTao', 'DESC')
      .limit(p_SoLuong)
      .getRawMany();

    return query;
  }

  async getSanPhamBanChay(soLuong: number): Promise<any[]> {
    return await this.sanphamRepository
      .createQueryBuilder('s')
      .select([
        's.MaSanPham',
        's.TenSP',
        's.MaSize',
        's.AnhDaiDien',
        's.MoTa',
        'g.DonGia AS DonGia',
        'gg.PhanTram AS PhanTram',
        'SUM(ct.soluong) AS SoLuong',
        'CAST((g.DonGia - (g.DonGia / 100 * gg.PhanTram)) AS SIGNED) AS GiaMoiKhiGiam',
      ])
      .innerJoin('s.gia', 'g', 'g.MaSanPham = s.MaSanPham')
      .leftJoin('s.giamgia', 'gg', 'gg.MaSanPham = s.MaSanPham')
      .innerJoin('chitietdonhang', 'ct', 'ct.MaSanPham = s.MaSanPham')
      .innerJoin('ct.donHang', 'dh', 'dh.MaDonHang = ct.MaDonHang')
      .where('dh.NgayDat >= NOW() - INTERVAL 30 DAY')
      .andWhere('dh.TinhTrang = 6')
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(gg.PhanTram IS NOT NULL AND NOW() BETWEEN gg.NgayBD AND gg.NgayKT)',
          )
            .orWhere(
              '(gg.PhanTram IS NULL AND NOW() BETWEEN g.NgayBD AND g.NgayKT)',
            )
            .orWhere(
              '(NOW() BETWEEN g.NgayBD AND g.NgayKT AND gg.PhanTram IS NULL)',
            );
        }),
      )
      .groupBy(
        's.MaSanPham, s.TenSP, s.MaSize, s.AnhDaiDien, s.MoTa, g.DonGia, gg.PhanTram',
      )
      .orderBy('SoLuong', 'DESC')
      .limit(soLuong)
      .getRawMany();
  }

  async getSanPhamGiamGia(p_SoLuong: number) {
    return await this.sanphamRepository
      .createQueryBuilder('s')
      .select([
        's.MaSanPham as MaSanPham',
        's.TenSP as TenSP',
        's.AnhDaiDien as AnhDaiDien',
        's.MaSize as MaSize',
        's.MoTa as MoTa',
        'g.DonGia as DonGia',
        'gg.PhanTram as PhanTram',
        'CAST((g.DonGia - (g.DonGia / 100 * gg.PhanTram)) AS SIGNED) AS GiaMoiKhiGiam',
      ])
      .innerJoin('s.gia', 'g', 'g.MaSanPham = s.MaSanPham')
      .innerJoin('s.giamgia', 'gg', 'gg.MaSanPham = s.MaSanPham')
      .innerJoin('s.size', 'sz', 'sz.MaSize = s.MaSize')
      .innerJoin('s.loaisanpham', 'l', 'l.MaLoaiSanPham = s.MaLoaiSanPham')
      .innerJoin('s.thuonghieu', 't', 't.MaThuongHieu = s.MaThuongHieu')
      .where('s.SoLuong != 0')
      .andWhere('NOW() BETWEEN gg.NgayBD AND gg.NgayKT')
      .orderBy('gg.PhanTram', 'DESC')
      .limit(p_SoLuong)
      .getRawMany();
  }

  async getSanPhamCungLoai(maSanPham: number, maLoaiSanPham: number) {
    const queryBuilder = this.sanphamRepository
      .createQueryBuilder('s')
      .select([
        's.MaSanPham as MaSanPham',
        's.TenSP as TenSP',
        's.AnhDaiDien as AnhDaiDien',
        'CAST((g.DonGia - (g.DonGia / 100 * gg.PhanTram)) AS SIGNED) AS GiaMoiKhiGiam',
      ])
      .addSelect('l.TenLoaiSanPham', 'TenLoaiSanPham')
      .addSelect('t.TenThuongHieu', 'TenThuongHieu')
      .addSelect('sz.TenSize', 'TenSize')
      .innerJoin('s.loaisanpham', 'l', 's.MaLoaiSanPham = l.MaLoaiSanPham')
      .innerJoin('s.thuonghieu', 't', 's.MaThuongHieu = t.MaThuongHieu')
      .leftJoin('Gia', 'g', 'g.MaSanPham = s.MaSanPham')
      .innerJoin('Size', 'sz', 'sz.MaSize = s.MaSize')
      .leftJoin('GiamGia', 'gg', 'gg.MaSanPham = s.MaSanPham')
      .where('s.MaSanPham != :maSanPham', { maSanPham })
      .andWhere('l.MaLoaiSanPham = :maLoaiSanPham', { maLoaiSanPham })
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            '(gg.PhanTram IS NOT NULL AND NOW() BETWEEN gg.NgayBD AND gg.NgayKT)',
          )
            .orWhere(
              '(gg.PhanTram IS NULL AND NOW() BETWEEN g.NgayBD AND g.NgayKT)',
            )
            .orWhere(
              '(NOW() BETWEEN g.NgayBD AND g.NgayKT AND gg.PhanTram IS NULL)',
            );
        }),
      )
      .groupBy(
        's.MaSanPham, s.TenSP, s.MaSize, s.AnhDaiDien, s.SoLuong, s.MoTa, g.DonGia, gg.PhanTram',
      );

    return await queryBuilder.getRawMany();
  }

  async getSanPhamById(p_MaSanPham: number) {
    const result = await this.sanphamRepository
      .createQueryBuilder('s')
      .select([
        's.MaSanPham as MaSanPham',
        's.TenSP as TenSP',
        's.AnhDaiDien as AnhDaiDien',
        's.MoTa as MoTa',
        'l.TenLoaiSanPham as TenLoaiSanPham',
        't.TenThuongHieu as TenThuongHieu',
        'sz.TenSize as TenSize',
        'g.DonGia as DonGia',
        'gg.PhanTram as PhanTram',
        'CAST((g.DonGia - (g.DonGia / 100 * gg.PhanTram)) AS SIGNED) AS GiaMoiKhiGiam',
        '(SELECT JSON_ARRAYAGG(JSON_OBJECT("TenThongSo", TSo.TenThongSo, "MoTa", TSo.MoTa)) FROM ThongSo TSo WHERE TSo.MaSanPham = s.MaSanPham) AS list_thongso',
      ])
      .innerJoin('s.loaisanpham', 'l')
      .innerJoin('s.thuonghieu', 't')
      .leftJoin('s.gia', 'g')
      .innerJoin('s.size', 'sz')
      .leftJoin('s.giamgia', 'gg')
      .where('s.MaSanPham = :p_MaSanPham', { p_MaSanPham })
      .groupBy('s.MaSanPham')
      .addGroupBy('s.TenSP')
      .addGroupBy('s.AnhDaiDien')
      .addGroupBy('s.MoTa')
      .addGroupBy('l.TenLoaiSanPham')
      .addGroupBy('t.TenThuongHieu')
      .addGroupBy('sz.TenSize')
      .addGroupBy('g.DonGia')
      .addGroupBy('gg.PhanTram')
      .getRawOne();
    return result;
  }
}
