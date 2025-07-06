import { Module } from '@nestjs/common';
import { ThongkeService } from './thongke.service';
import { ThongkeController } from './thongke.controller';
import { User } from '@/users/entities/user.entity';
import { Donhang } from '@/donhang/entities/donhang.entity';
import { Sanpham } from '@/sanpham/entities/sanpham.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [
      TypeOrmModule.forFeature([Donhang, Sanpham, User]),
    ],
  controllers: [ThongkeController],
  providers: [ThongkeService],
})
export class ThongkeModule {}
