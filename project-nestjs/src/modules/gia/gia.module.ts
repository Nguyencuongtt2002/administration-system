import { Module } from '@nestjs/common';
import { GiaService } from './gia.service';
import { GiaController } from './gia.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gia } from './entities/gia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Gia])],
  controllers: [GiaController],
  providers: [GiaService],
})
export class GiaModule {}
