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
import { SizeService } from './size.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('Size')
@Controller('size')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo size mới',
    description: 'API để tạo một size mới trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo size thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Size được tạo thành công!',
        code: 201,
        data: {
          MaSize: 1,
          TenSize: 'XL',
          MoTa: 'Size XL',
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
  create(@Body() createSizeDto: CreateSizeDto) {
    return this.sizeService.create(createSizeDto);
  }

  @ResponseMessage('Lấy danh sách size thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách size thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách size thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy size',
    schema: {
      example: {
        status: 'failed',
        message: 'Size không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.sizeService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin liên hệ',
    description:
      'API này được sử dụng để lấy chi tiết của một size dựa trên ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin size thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy thông tin size thành công',
        code: 200,
        data: {
          MaSize: 1,
          TenSize: 'XL',
          MoTa: 'Size XL',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Size không được tìm thấy',
    schema: {
      example: {
        status: 'failed',
        message: 'Size không được tìm thấy',
        code: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.sizeService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin size' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật size thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Update size Success',
        data: {
          MaSize: 1,
          TenSize: 'XL',
          MoTa: 'Size XL',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy size',
    schema: {
      example: {
        status: 'failed',
        message: 'liên hệ Not Found',
        code: 16004,
      },
    },
  })
  update(@Body() updateLienheDto: UpdateSizeDto) {
    return this.sizeService.update(updateLienheDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa size theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa size thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Delete size Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Size',
    schema: {
      example: {
        status: 'failed',
        message: 'Size Not Found',
        code: 16005,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.sizeService.remove(+id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục size đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục size thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore size Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy size đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted size Not Found',
      },
    },
  })
  restore(@Param('id') id: string) {
    return this.sizeService.restore(+id);
  }
}
