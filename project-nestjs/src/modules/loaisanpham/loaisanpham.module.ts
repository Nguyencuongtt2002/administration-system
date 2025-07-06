import { Module } from '@nestjs/common';
import { LoaisanphamService } from './loaisanpham.service';
import { LoaisanphamController } from './loaisanpham.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loaisanpham } from './entities/loaisanpham.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loaisanpham])],
  controllers: [LoaisanphamController],
  providers: [LoaisanphamService],
})
export class LoaisanphamModule {}
