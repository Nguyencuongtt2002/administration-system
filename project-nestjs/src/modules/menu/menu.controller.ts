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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo menu mới',
    description: 'API để tạo một menu mới trong hệ thống.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tạo menu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Menu được tạo thành công!',
        code: 201,
        data: {
          MaMenu: 1,
          TenMenu: 'Menu 1',
          Link: 'Mô tả cho menu 1',
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
        errors: [
          {
            field: 'name',
            message: 'Tên menu là bắt buộc',
          },
        ],
      },
    },
  })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @ResponseMessage('Lấy danh sách Menu thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách Menu thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách Menu thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Menu',
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
    return this.menuService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin menu',
    description:
      'API này được sử dụng để lấy chi tiết của một menu dựa trên ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lấy thông tin menu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy thông tin menu thành công',
        code: 200,
        data: {
          MaMenu: 'M001',
          TenMenu: 'Menu 1',
          Link: 'https://example.com/menu1',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Menu không được tìm thấy',
    schema: {
      example: {
        status: 'failed',
        message: 'Menu không được tìm thấy',
        code: 404,
      },
    },
  })
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch()
  @ApiOperation({ summary: 'Cập nhật thông tin Menu' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật Menu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Update Menu Success',
        data: {
          MaMenu: 10,
          TenMenu: 'Updated Menu Name',
          Link: 'updated-link',
          updatedAt: '2024-11-02T12:34:56Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Menu',
    schema: {
      example: {
        status: 'failed',
        message: 'Menu Not Found',
        code: 16004,
      },
    },
  })
  update(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa Menu theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Xóa Menu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Delete Menu Success',
        data: {
          MaMenu: 10,
          deletedAt: '2024-11-02T12:34:56Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Menu',
    schema: {
      example: {
        status: 'failed',
        message: 'Menu Not Found',
        code: 16005,
      },
    },
  })
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục Menu đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục Menu thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore Menu Success',
        data: {
          MaMenu: 10,
          TenMenu: 'Restored Menu Name',
          Link: 'restored-link',
          restoredAt: '2024-11-02T12:34:56Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy Menu đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted Menu Not Found',
        code: 16006,
      },
    },
  })
  restore(@Param('id') id: string) {
    return this.menuService.restore(+id);
  }
}
