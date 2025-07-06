import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DonhangService } from './donhang.service';
import { CreateDonhangDto } from './dto/create-donhang.dto';
import { UpdateDonhangDto } from './dto/update-donhang.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorator/customize';

@ApiTags('donhang')
@Controller('donhang')
export class DonhangController {
  constructor(private readonly donhangService: DonhangService) {}

  @Post()
  create(@Body() createDonhangDto: CreateDonhangDto) {
    return this.donhangService.createDonHang(createDonhangDto);
  }
}
