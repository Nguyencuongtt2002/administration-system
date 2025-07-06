import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('lienhe')
export class Lienhe {
  @PrimaryGeneratedColumn()
  MaLienHe: number;
  @Column({ length: 30 })
  Email: string;
  @Column()
  DiaChi: string;
  @Column({ length: 15 })
  SoDienThoai: string;
  @DeleteDateColumn()
  deletedAt?: Date;
}
