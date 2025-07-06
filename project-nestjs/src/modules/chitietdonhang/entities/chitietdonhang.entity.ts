import { Donhang } from '@/donhang/entities/donhang.entity';
import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('chitietdonhang')
export class Chitietdonhang {
  @PrimaryGeneratedColumn()
  MaChiTiet: number;
  @Column()
  MaDonHang: number;
  @Column()
  MaSanPham: number;
  @Column()
  SoLuong: number;
  @Column()
  GiaTien: number;
  @DeleteDateColumn()
    deletedAt?: Date;
    
 @ManyToOne(() => Sanpham, (sanPham) => sanPham.chiTietDonHang)
  @JoinColumn({ name: 'MaSanPham' })
    sanPham: Sanpham;
    
 @ManyToOne(() => Donhang, (donHang) => donHang.chiTietDonHang)
  @JoinColumn({ name: 'MaDonHang' })
  donHang: Donhang;
}
