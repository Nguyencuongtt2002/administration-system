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
import { LienheService } from './lienhe.service';
import { CreateLienheDto } from './dto/create-lienhe.dto';
import { UpdateLienheDto } from './dto/update-lienhe.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('LienHe')
@Controller('lienhe')
export class LienheController {
  constructor(private readonly lienheService: LienheService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo liên hệ mới',
    description: 'API để tạo một liên hệ mới trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo liên hệ thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Liên hệ được tạo thành công!',
        code: 201,
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
  create(@Body() createLienheDto: CreateLienheDto) {
    return this.lienheService.create(createLienheDto);
  }

  @ResponseMessage('Lấy danh sách liên hệ thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách liên hệ thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách liên hệ thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy liên hệ',
    schema: {
      example: {
        status: 'failed',
        message: 'Menu không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.lienheService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin liên hệ',
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
    return this.lienheService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin liên hệ' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật Liên hệ thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Update Lien he Success',
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
    description: 'Không tìm thấy liên hệ',
    schema: {
      example: {
        status: 'failed',
        message: 'liên hệ Not Found',
        code: 16004,
      },
    },
  })
  update(@Body() updateLienheDto: UpdateLienheDto) {
    return this.lienheService.update(updateLienheDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa Liên hệ theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa lien he thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Delete lien he Success',
        data: {
          MaMenu: 10,
          deletedAt: '2024-11-02T12:34:56Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Lien he',
    schema: {
      example: {
        status: 'failed',
        message: 'lien he Not Found',
        code: 16005,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.lienheService.remove(+id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục Lien he đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục lien he thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore Menu Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy lien he đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted Lien he Not Found',
      },
    },
  })
  restore(@Param('id') id: string) {
    return this.lienheService.restore(+id);
  }
}
