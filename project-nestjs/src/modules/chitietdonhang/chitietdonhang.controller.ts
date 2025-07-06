import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChitietdonhangService } from './chitietdonhang.service';
import { CreateChitietdonhangDto } from './dto/create-chitietdonhang.dto';
import { UpdateChitietdonhangDto } from './dto/update-chitietdonhang.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('chitietdonhang')
@Controller('chitietdonhang')
export class ChitietdonhangController {
  constructor(private readonly chitietdonhangService: ChitietdonhangService) {}

  @Post()
  create(@Body() createChitietdonhangDto: CreateChitietdonhangDto) {
    return this.chitietdonhangService.create(createChitietdonhangDto);
  }

  @Get()
  findAll() {
    return this.chitietdonhangService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chitietdonhangService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChitietdonhangDto: UpdateChitietdonhangDto,
  ) {
    return this.chitietdonhangService.update(+id, updateChitietdonhangDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chitietdonhangService.remove(+id);
  }
}
