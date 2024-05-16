import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto} from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(jwtAuthGuard)
@Controller('sales')
export class SalesController {

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
  }

  @Post('/createQueryRunner')
  createQueryRunner(@Body() createSaleDto: CreateSaleDto) {
  }

  @Get()
  findAll() {
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
  }
}
