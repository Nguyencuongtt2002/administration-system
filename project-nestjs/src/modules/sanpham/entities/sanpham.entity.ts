import { Chitietdonhang } from '@/chitietdonhang/entities/chitietdonhang.entity';
import { Gia } from '@/gia/entities/gia.entity';
import { Giamgia } from '@/giamgia/entities/giamgia.entity';
import { Loaisanpham } from '@/loaisanpham/entities/loaisanpham.entity';
import { Size } from '@/size/entities/size.entity';
import { ThuongHieu } from '@/thuonghieu/entities/thuonghieu.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('sanpham')
export class Sanpham {
  @PrimaryGeneratedColumn()
  MaSanPham: number;
  @Column()
  TenSP: string;
  @Column()
  MoTa: string;
  @Column()
  NgayTao: Date;

  @Column({ nullable: true })
  MaLoaiSanPham: number;

  @Column({ nullable: true })
  MaThuongHieu: number;

  @Column({ nullable: true })
  MaSize: number;

  @Column({ type: 'varchar' })
  AnhDaiDien: string;

  @Column()
  SoLuong: number;

  @ManyToOne(() => Loaisanpham, (loaiSanPham) => loaiSanPham.sanpham, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'MaLoaiSanPham' })
  loaisanpham: Loaisanpham;

  @ManyToOne(() => ThuongHieu, (thuongHieu) => thuongHieu.sanpham, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'MaThuongHieu' })
  thuonghieu: ThuongHieu;

  @ManyToOne(() => Size, (size) => size.sanpham, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'MaSize' })
  size: Size;

  @OneToMany(() => Giamgia, (giamGia) => giamGia.sanPham)
  giamgia: Giamgia[];
  @OneToOne(() => Gia, (gia) => gia.sanPham)
  gia: Gia[];

  @OneToMany(() => Chitietdonhang, (chiTiet) => chiTiet.sanPham)
  chiTietDonHang: Chitietdonhang[];
}
