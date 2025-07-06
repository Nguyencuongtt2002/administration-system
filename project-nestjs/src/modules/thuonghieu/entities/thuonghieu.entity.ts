import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('thuonghieu')
export class ThuongHieu {
  @PrimaryGeneratedColumn()
  MaThuongHieu: number;

  @Column({ length: 50 })
  TenThuongHieu: string;
  @Column()
  GioiThieu: string;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Sanpham, (sanPham) => sanPham.thuonghieu)
  sanpham: Sanpham[];
}
