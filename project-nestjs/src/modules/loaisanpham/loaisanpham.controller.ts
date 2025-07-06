import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { LoaisanphamService } from './loaisanpham.service';
import { CreateLoaisanphamDto } from './dto/create-loaisanpham.dto';
import { UpdateLoaisanphamDto } from './dto/update-loaisanpham.dto';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
} from 'src/decorator/customize';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';

@ApiTags('loaisanpham')
@Controller('loaisanpham')
export class LoaisanphamController {
  constructor(private readonly loaisanphamService: LoaisanphamService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'Loại sản phẩm được tạo thành công',
    type: CreateLoaisanphamDto,
  })
  @ApiBadRequestResponse({
    description: 'Yêu cầu không hợp lệ',
  })
  async create(@Body() createLoaiSanPhamDto: CreateLoaisanphamDto) {
    return await this.loaisanphamService.create(createLoaiSanPhamDto);
  }

  @Public()
  @Get()
  @ApiQuery({ name: 'current', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'searchKey', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    type: String,
    enum: ['ASC', 'DESC'],
  })
  findAll(
    @Query('current') currentPage: string = '1',
    @Query('pageSize') limit: string = '10',
    @Query('searchKey') searchKey?: string,
    @Query('sortBy') sortBy: string = 'MaLoaiSanPham',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.loaisanphamService.findAll(
      +currentPage,
      +limit,
      searchKey,
      sortBy,
      sortOrder,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loaisanphamService.findOne(+id);
  }

  @Patch()
  update(@Body() updateCategoryDto: UpdateLoaisanphamDto) {
    return this.loaisanphamService.update(updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loaisanphamService.remove(+id);
  }

  @ResponseMessage('Khôi phục loại sản phẩm thành công!')
  @Patch(':id/restore')
  async restore(@Param('id') id: string) {
    return await this.loaisanphamService.restore(+id);
  }
}
