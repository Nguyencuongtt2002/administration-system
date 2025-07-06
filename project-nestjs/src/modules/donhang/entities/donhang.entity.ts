import { Chitietdonhang } from '@/chitietdonhang/entities/chitietdonhang.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('donhang')
export class Donhang {
  @PrimaryGeneratedColumn()
  MaDonHang: number;
  @Column()
  NgayDat: Date;
  @Column()
  NgayGiao: Date;
  @Column()
  HoTen: string;
  @Column()
  DiaChi: string;
  @Column()
  SoDienThoai: string;
  @Column()
  PhuongThucThanhToan: string;
  @Column()
  MaNguoiDung: number;
  @Column()
  TinhTrang: number;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Chitietdonhang, (chiTiet) => chiTiet.donHang)
  chiTietDonHang: Chitietdonhang[];
}
