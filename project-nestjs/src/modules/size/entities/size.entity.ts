import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('size')
export class Size {
  @PrimaryGeneratedColumn()
  MaSize: number;

  @Column({ length: 10 })
  TenSize: string;
  @Column({ length: 100 })
  MoTa: string;
  @DeleteDateColumn()
  deletedAt?: Date;
  @OneToMany(() => Sanpham, (sanPham) => sanPham.size)
  sanpham: Sanpham[];
}
