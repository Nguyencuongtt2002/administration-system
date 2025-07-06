import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('gioithieu')
export class Gioithieu {
  @PrimaryGeneratedColumn()
  MaGioiThieu: number;
  
  @Column({ type: 'varchar', length: 50 })
  TieuDe: string;

  @Column({ type: 'longtext' })
  NoiDung: string;

  @Column({ type: 'varchar' })
  HinhAnh: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
