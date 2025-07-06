import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { SanphamService } from './sanpham.service';
import { CreateSanphamDto } from './dto/create-sanpham.dto';
import { UpdateSanphamDto } from './dto/update-sanpham.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('sanpham')
@Controller('sanpham')
export class SanphamController {
  constructor(private readonly sanphamService: SanphamService) {}

  @Post()
  create(@Body() createSanphamDto: CreateSanphamDto) {
    return this.sanphamService.create(createSanphamDto);
  }

  @Get()
  findAll() {
    return this.sanphamService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sanphamService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSanphamDto: UpdateSanphamDto) {
    return this.sanphamService.update(+id, updateSanphamDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sanphamService.remove(+id);
  }

  @Get('sanphammoi/:sl')
  getSanPhamMoi(@Param('sl') sl: number) {
    return this.sanphamService.getSanPhamMoi(+sl);
  }

  @Get('sanphambanchay/:sl')
  getSanPhamBanChay(@Param('sl') sl: number) {
    return this.sanphamService.getSanPhamBanChay(+sl);
  }

  @Get('sanphamgiamgia/:sl')
  getSanPhamGiamGia(@Param('sl') sl: number) {
    return this.sanphamService.getSanPhamGiamGia(+sl);
  }

  @Post('sanphamcungloai')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        MaSanPham: { type: 'number', example: 1 },
        MaLoaiSanPham: { type: 'number', example: 1 },
      },
    },
  })
  getSanPhamCungLoai(
    @Body('MaSanPham') MaSanPham: number,
    @Body('MaLoaiSanPham') MaLoaiSanPham: number,
  ) {
    return this.sanphamService.getSanPhamCungLoai(MaSanPham, MaLoaiSanPham);
  }

  @Get('getbyid/:id')
  getSanPhamById(@Param('id') id: number) {
    return this.sanphamService.getSanPhamById(+id);
  }
}
