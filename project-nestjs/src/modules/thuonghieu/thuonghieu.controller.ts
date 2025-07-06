import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ThuonghieuService } from './thuonghieu.service';
import { CreateThuonghieuDto } from '@/thuonghieu/dto/create-thuonghieu.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { UpdateThuonghieuDto } from '@/thuonghieu/dto/update-thuonghieu.dto';

@ApiTags('thuonghieu')
@Controller('thuonghieu')
export class ThuonghieuController {
  constructor(private readonly thuonghieuService: ThuonghieuService) {}

  @ApiResponse({
    status: 200,
    description: 'description goes here',
    type: CreateThuonghieuDto,
  })
  @Post()
  create(@Body() createThuonghieuDto: CreateThuonghieuDto) {
    return this.thuonghieuService.create(createThuonghieuDto);
  }

  @ApiOkResponse({
    description: 'Lấy danh sách thương hiệu thành công!',
    type: CreateThuonghieuDto,
    isArray: true,
  })
  @ResponseMessage('Lấy danh sách thương hiệu thành công!')
  @Get()
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.thuonghieuService.findAll(+currentPage, +limit, qs);
  }
  @ResponseMessage('Lấy thương hiệu theo id')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thuonghieuService.findOne(+id);
  }

  @ResponseMessage('Cập nhật thương hiệu thành công!')
  @Patch()
  update(@Body() updateThuonghieuDto: UpdateThuonghieuDto) {
    return this.thuonghieuService.update(updateThuonghieuDto);
  }

  @ResponseMessage('Xóa thương hiệu thành công!')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thuonghieuService.remove(+id);
  }

  @ResponseMessage('Khôi phục thương hiệu thành công!')
  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.thuonghieuService.restore(+id);
  }
}
