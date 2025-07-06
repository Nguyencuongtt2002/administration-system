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
import { GioithieuService } from './gioithieu.service';
import { CreateGioithieuDto } from './dto/create-gioithieu.dto';
import { UpdateGioithieuDto } from './dto/update-gioithieu.dto';
import { ResponseMessage } from 'src/decorator/customize';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('GioiThieu')
@Controller('gioithieu')
export class GioithieuController {
  constructor(private readonly gioithieuService: GioithieuService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo giới thiệu mới',
    description: 'API để tạo một giới thiệu mới trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo giới thiệu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Giới thiệu được tạo thành công!',
        code: 201,
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
  create(@Body() createGioithieuDto: CreateGioithieuDto) {
    return this.gioithieuService.create(createGioithieuDto);
  }

  @ResponseMessage('Lấy danh sách giới thiệu thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách giới thiệu thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách giới thiệu thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giới thiệu',
    schema: {
      example: {
        status: 'failed',
        message: 'Giới thiệu không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.gioithieuService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin giới thiệu',
    description:
      'API này được sử dụng để lấy chi tiết của một liên hệ dựa trên ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin liên hệ thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy thông tin liên hệ thành công',
        code: 200,
        data: {
          MaLienHe: 1,
          Email: 'example@gmail.com',
          DiaChi: 'Thái bình',
          SoDienThoai: '01215753055',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'liên hệ không được tìm thấy',
    schema: {
      example: {
        status: 'failed',
        message: 'liên hệ không được tìm thấy',
        code: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.gioithieuService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin giới thiệu' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật giới thiệu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Update Gioi Thieu Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy giới thiệu',
    schema: {
      example: {
        status: 'failed',
        message: 'Gioi Thieu Not Found',
        code: 16004,
      },
    },
  })
  update(@Body() updateGioithieuDto: UpdateGioithieuDto) {
    return this.gioithieuService.update(updateGioithieuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa giới thiệu theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa giới thiệu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Delete gioi thieu Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Lien he',
    schema: {
      example: {
        status: 'failed',
        message: 'Gioi thieu Not Found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.gioithieuService.remove(+id);
  }

  @ResponseMessage('Khôi phục giới thiệu thành công!')
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục giới thiệu đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục giới thiệu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore Gioi Thieu Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy gioi thieu đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted Gioi Thieu Not Found',
      },
    },
  })
  async restore(@Param('id') id: string) {
    return await this.gioithieuService.restore(+id);
  }
}
