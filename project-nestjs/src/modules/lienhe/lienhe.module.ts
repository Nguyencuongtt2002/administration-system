import { Module } from '@nestjs/common';
import { LienheService } from './lienhe.service';
import { LienheController } from './lienhe.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lienhe } from './entities/lienhe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lienhe])],
  controllers: [LienheController],
  providers: [LienheService],
})
export class LienheModule {}
