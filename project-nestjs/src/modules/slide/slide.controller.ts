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
import { SlideService } from './slide.service';
import { CreateSlideDto } from './dto/create-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('Slide')
@Controller('slide')
export class SlideController {
  constructor(private readonly slideService: SlideService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo slide mới',
    description: 'API để tạo một slide mới trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo slide thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Slide được tạo thành công!',
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
  create(@Body() createSlideDto: CreateSlideDto) {
    return this.slideService.create(createSlideDto);
  }

  @ResponseMessage('Lấy danh sách slide thành công!')
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách slide' })
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách slide thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách slide thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy slide',
    schema: {
      example: {
        status: 'failed',
        message: 'Slide không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.slideService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin slide',
    description:
      'API này được sử dụng để lấy chi tiết của một slide dựa trên ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin slide thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy thông tin slide thành công',
        code: 200,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Slide không được tìm thấy',
    schema: {
      example: {
        status: 'failed',
        message: 'Slide không được tìm thấy',
        code: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.slideService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin slide' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật slide thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Update Slide Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy slide',
    schema: {
      example: {
        status: 'failed',
        message: 'Slide Not Found',
        code: 16004,
      },
    },
  })
  update(@Body() updateSlideDto: UpdateSlideDto) {
    return this.slideService.update(updateSlideDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa slide theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa slide thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Delete Slide Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy slide',
    schema: {
      example: {
        status: 'failed',
        message: 'Slide Not Found',
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.slideService.remove(+id);
  }

  @ResponseMessage('Khôi phục slide thành công!')
  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục slide đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục slide thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore Slide Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy slide đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted Slide Not Found',
      },
    },
  })
  async restore(@Param('id') id: string) {
    return await this.slideService.restore(+id);
  }
}
