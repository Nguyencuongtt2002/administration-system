import { Module } from '@nestjs/common';
import { GioithieuService } from './gioithieu.service';
import { GioithieuController } from './gioithieu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gioithieu } from './entities/gioithieu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gioithieu])],
  controllers: [GioithieuController],
  providers: [GioithieuService],
})
export class GioithieuModule {}
