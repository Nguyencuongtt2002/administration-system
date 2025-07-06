import { Module } from '@nestjs/common';
import { GiamgiaService } from './giamgia.service';
import { GiamgiaController } from './giamgia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Giamgia } from './entities/giamgia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Giamgia])],
  controllers: [GiamgiaController],
  providers: [GiamgiaService],
})
export class GiamgiaModule {}
