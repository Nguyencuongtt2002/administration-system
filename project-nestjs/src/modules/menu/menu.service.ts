import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from './entities/menu.entity';
import { Repository } from 'typeorm';
import aqp from 'api-query-params';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const newMenu = this.menuRepository.create(createMenuDto);
    return await this.menuRepository.save(newMenu);
  }

  async findAll(currentPage: number, limit: number, searchKey: string) {
    const { filter, sort } = aqp(searchKey);
    delete filter.current;
    delete filter.pageSize;
    const offset = (currentPage - 1) * limit;
    const defaultLimit = limit || 10;
    const totalItems = await this.menuRepository.count({
      where: filter,
    });
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.menuRepository.find({
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
    const menu = await this.menuRepository.findOne({
      where: {
        MaMenu: id,
      },
    });
    return menu;
  }

  async update(updateMenuDto: UpdateMenuDto) {
    const res = await this.menuRepository
      .createQueryBuilder()
      .update(Menu)
      .set({
        TenMenu: updateMenuDto.TenMenu,
        Link: updateMenuDto.Link,
      })
      .where('MaMenu = :MaMenu ', {
        MaMenu: updateMenuDto.MaMenu,
      })
      .execute();
    return res;
  }

  async remove(MaMenu: number) {
    await this.menuRepository
      .createQueryBuilder()
      .softDelete()
      .where('MaMenu = :MaMenu', { MaMenu })
      .execute();
  }

  async restore(MaMenu: number) {
    await this.menuRepository
      .createQueryBuilder()
      .restore()
      .where('MaMenu = :MaMenu', { MaMenu })
      .execute();
  }
}
