import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('nhacungcap')
export class Nhacungcap {
  @PrimaryGeneratedColumn()
  MaNhaCungCap: number;

  @Column({ length: 25 })
  TenNhaCungCap: string;
  @Column({ length: 25 })
  DiaChi: string;
  @Column({ length: 15 })
  SoDienThoai: string;
  @Column({ length: 30 })
  Email: string;
  @DeleteDateColumn()
  deletedAt?: Date;
}
