import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gia')
export class Gia {
  @PrimaryGeneratedColumn()
  MaGia: number;
  @Column({ nullable: true })
  MaSanPham: number;
  @Column()
  NgayBD: Date;
  @Column()
  NgayKT: Date;
  @Column()
  DonGia: number;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToOne(() => Sanpham, (sanPham) => sanPham.giamgia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'MaSanPham' })
  sanPham: Sanpham;
}
