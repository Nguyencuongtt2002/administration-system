import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('giamgia')
export class Giamgia {
  @PrimaryGeneratedColumn()
  MaGiamGia: number;
  @Column({ nullable: true })
  MaSanPham: number;
  @Column()
  PhanTram: number;
  @Column()
  NgayBD: Date;
  @Column()
  NgayKT: Date;
  @DeleteDateColumn()
  deletedAt?: Date;
  @ManyToOne(() => Sanpham, (sanPham) => sanPham.giamgia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'MaSanPham' })
  sanPham: Sanpham;
}
