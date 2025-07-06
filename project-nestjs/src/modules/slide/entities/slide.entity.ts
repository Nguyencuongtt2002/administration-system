import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('slide')
export class Slide {
  @PrimaryGeneratedColumn()
  MaSlide: number;

  @Column({ type: 'varchar' })
  Anh: string;
}
