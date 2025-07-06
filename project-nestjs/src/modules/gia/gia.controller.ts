import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GiaService } from './gia.service';
import { CreateGiaDto } from './dto/create-gia.dto';
import { UpdateGiaDto } from './dto/update-gia.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('gia')
@Controller('gia')
export class GiaController {
  constructor(private readonly giaService: GiaService) {}

  @Post()
  create(@Body() createGiaDto: CreateGiaDto) {
    return this.giaService.create(createGiaDto);
  }

  @Get()
  findAll() {
    return this.giaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.giaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGiaDto: UpdateGiaDto) {
    return this.giaService.update(+id, updateGiaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.giaService.remove(+id);
  }
}
