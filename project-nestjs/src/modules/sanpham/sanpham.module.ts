import { Module } from '@nestjs/common';
import { SanphamService } from './sanpham.service';
import { SanphamController } from './sanpham.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sanpham } from './entities/sanpham.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sanpham])],
  controllers: [SanphamController],
  providers: [SanphamService],
  exports: [SanphamService],
})
export class SanphamModule {}
