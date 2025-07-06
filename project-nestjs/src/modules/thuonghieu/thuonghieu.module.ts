import { Module } from '@nestjs/common';
import { ThuonghieuService } from './thuonghieu.service';
import { ThuonghieuController } from './thuonghieu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThuongHieu } from './entities/thuonghieu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ThuongHieu])],
  controllers: [ThuonghieuController],
  providers: [ThuonghieuService],
  exports: [ThuonghieuService],
})
export class ThuonghieuModule {}
