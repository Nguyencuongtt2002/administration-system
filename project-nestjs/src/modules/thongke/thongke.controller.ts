import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ThongkeService } from './thongke.service';
import { UpdateThongkeDto } from './dto/update-thongke.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('thongke')
@Controller('thongke')
export class ThongkeController {
  constructor(private readonly thongkeService: ThongkeService) {}

  @Get('tong-so-luong')
  @ApiOperation({ summary: 'Thống kê tổng số lượng' }) 
  @ApiResponse({
    status: 200,
    description: 'Lấy thống kê thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy thống kê thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Lỗi hệ thống' }) 
  async thongKeTongSoLuong() {
    return this.thongkeService.thongKeTongSoLuong();
  }

  @Get()
  findAll() {
    return this.thongkeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.thongkeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateThongkeDto: UpdateThongkeDto) {
    return this.thongkeService.update(+id, updateThongkeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.thongkeService.remove(+id);
  }
}
