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
import { GiamgiaService } from './giamgia.service';
import { CreateGiamgiaDto } from './dto/create-giamgia.dto';
import { UpdateGiamgiaDto } from './dto/update-giamgia.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('GiamGia')
@Controller('giamgia')
export class GiamgiaController {
  constructor(private readonly giamgiaService: GiamgiaService) {}
  @Post()
  @ApiOperation({ summary: 'Create a new Giamgia' })
  @ApiResponse({
    status: 201,
    description: 'Tạo giảm giá thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Giảm giá đã được tạo thành công!',
        code: 201,
        data: {
          MaGiamGia: 1,
          MaSanPham: 123,
          PhanTram: 20,
          NgayBD: '2024-01-01',
          NgayKT: '2024-12-31',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      example: {
        status: 'failed',
        message: 'Dữ liệu đầu vào không hợp lệ',
        code: 400,
      },
    },
  })
  create(@Body() createGiamgiaDto: CreateGiamgiaDto) {
    return this.giamgiaService.create(createGiamgiaDto);
  }

  @ResponseMessage('Lấy danh sách giảm giá thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách giảm giá thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách giảm giá thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giảm giá',
    schema: {
      example: {
        status: 'failed',
        message: 'Giảm giá không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage?: string,
    @Query('pageSize') limit?: string,
    @Query() qs?: string,
  ) {
    return this.giamgiaService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giamgiaService.findOne(+id);
  }

  @Patch()
  update(@Body() updateGiamgiaDto: UpdateGiamgiaDto) {
    return this.giamgiaService.update(updateGiamgiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giamgiaService.remove(+id);
  }
}
