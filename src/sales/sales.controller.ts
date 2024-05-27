import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto} from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindByDateDto } from './dto/findByDate-sale.dto';

@UseGuards(jwtAuthGuard)
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.create(createSaleDto);
  }

  @Post('/createQueryRunner')
  createQueryRunner(@Body() createSaleDto: CreateSaleDto) {
    return this.salesService.createQueryRunner(createSaleDto);
  }

  @Get('/findByDate')
  findByDate(@Query() findByDate : FindByDateDto) {
    return this.salesService.findByDate(findByDate);
  }

  @Get()
  findAll() {
    return this.salesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salesService.findOne(+id);
  }

  @Get('/clientData/:id')
  findClient(@Param('id') id: string) {
    Number(id)
    return this.salesService.findClient(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto) {
    return this.salesService.update(+id, updateSaleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.salesService.remove(+id);
  }
}
