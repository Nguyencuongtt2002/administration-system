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
import { NhacungcapService } from './nhacungcap.service';
import { CreateNhacungcapDto } from './dto/create-nhacungcap.dto';
import { UpdateNhacungcapDto } from './dto/update-nhacungcap.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseMessage } from 'src/decorator/customize';

@ApiTags('nhacungcap')
@Controller('nhacungcap')
export class NhacungcapController {
  constructor(private readonly nhacungcapService: NhacungcapService) {}

  @Post()
  create(@Body() createNhacungcapDto: CreateNhacungcapDto) {
    return this.nhacungcapService.create(createNhacungcapDto);
  }

  @ResponseMessage('Lấy danh sách nhà cung cấp thành công!')
  @Get()
  @ApiResponse({
    status: 200,
    description: 'Lấy danh sách nhà cung cấp thành công!',
    schema: {
      example: {
        status: 'success',
        message: 'Lấy danh sách nhà cung cấp thành công!',
        code: 200,
        data: [],
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy nhà cung cấp',
    schema: {
      example: {
        status: 'failed',
        message: 'Nhà cung cấp không được tìm thấy',
        code: 404,
      },
    },
  })
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.nhacungcapService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nhacungcapService.findOne(+id);
  }

  @Patch()
  update(@Body() data: UpdateNhacungcapDto) {
    return this.nhacungcapService.update(data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nhacungcapService.remove(+id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'Khôi phục nhà cung cấp đã xóa theo ID' })
  @ApiResponse({
    status: 200,
    description: 'Khôi phục nhà cung cấp thành công',
    schema: {
      example: {
        status: 'success',
        message: 'Restore nhà cung cấp Success',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy nhà cung cấp đã xóa',
    schema: {
      example: {
        status: 'failed',
        message: 'Deleted nhà cung cấp Not Found',
      },
    },
  })
  restore(@Param('id') id: string) {
    return this.nhacungcapService.restore(+id);
  }
}
