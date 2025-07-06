import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('menu')
export class Menu {
  @PrimaryGeneratedColumn()
  MaMenu: number;

  @Column({ length: 30 })
  TenMenu: string;
  @Column({ length: 20 })
  Link: string;
  @DeleteDateColumn()
  deletedAt?: Date;
}
