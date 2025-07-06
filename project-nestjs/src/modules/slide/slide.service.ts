import { Injectable } from '@nestjs/common';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Slide } from './entities/slide.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class SlideService {
  constructor(
    @InjectRepository(Slide)
    private slideRepository: Repository<Slide>,
  ) {}

  async create(createSlideDto: CreateSlideDto) {
    const slide = this.slideRepository.create(createSlideDto);
    return await this.slideRepository.save(slide);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.slideRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.slideRepository.find({
      where: filter,
      skip: offset,
      take: defaultLimit,
      order: sort as any,
    });
    // Trả về kết quả
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: number) {
    const res = await this.slideRepository.findOne({
      where: {
        MaSlide: id,
      },
    });
    return res;
  }

  async update(updateSlideDto: UpdateSlideDto) {
    const res = await this.slideRepository
      .createQueryBuilder()
      .update(Slide)
      .set({
        ...updateSlideDto,
      })
      .where('MaSlide = :MaSlide', {
        MaSlide: updateSlideDto.MaSlide,
      })
      .execute();
    return res;
  }

  async remove(id: number) {
    await this.slideRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaSlide = :MaSlide', { id })
      .execute();
  }

  async restore(MaSlide: number) {
    await this.slideRepository
      .createQueryBuilder()
      .restore()
      .where('MaSlide = :MaSlide', { MaSlide })
      .execute();
  }
}
