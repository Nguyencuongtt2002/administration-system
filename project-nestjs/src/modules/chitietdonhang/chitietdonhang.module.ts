import { Module } from '@nestjs/common';
import { ChitietdonhangService } from './chitietdonhang.service';
import { ChitietdonhangController } from './chitietdonhang.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chitietdonhang } from './entities/chitietdonhang.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chitietdonhang])],
  controllers: [ChitietdonhangController],
  providers: [ChitietdonhangService],
  exports: [ChitietdonhangService],
})
export class ChitietdonhangModule {}
