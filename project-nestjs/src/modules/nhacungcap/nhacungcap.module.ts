import { Module } from '@nestjs/common';
import { NhacungcapService } from './nhacungcap.service';
import { NhacungcapController } from './nhacungcap.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nhacungcap } from './entities/nhacungcap.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nhacungcap])],
  controllers: [NhacungcapController],
  providers: [NhacungcapService],
})
export class NhacungcapModule {}
