import { Module } from '@nestjs/common';
import { SlideService } from './slide.service';
import { SlideController } from './slide.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slide } from './entities/slide.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Slide])],
  controllers: [SlideController],
  providers: [SlideService],
})
export class SlideModule {}
