import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('loaisanpham')
export class Loaisanpham {
  @PrimaryGeneratedColumn()
  MaLoaiSanPham: number;

  @Column({ length: 50 })
  TenLoaiSanPham: string;
  @Column()
  GioiThieu: string;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Sanpham, (sanPham) => sanPham.loaisanpham)
  sanpham: Sanpham[];
}
