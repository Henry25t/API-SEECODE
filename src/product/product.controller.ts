import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearProductDto } from './dto/search-product.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindProductByDateDto } from './dto/findByDate-product';

@UseGuards(jwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('/productByDate')
  findAll(@Query() findProductByDateDto: FindProductByDateDto) {
    return this.productService.findByDate(findProductByDateDto);
  }
  @Get('/productByDateQueyBuilder')
  findByQueryBuilder(@Query() findProductByDateDto: FindProductByDateDto) {
    return this.productService.findByDateQueryBuilder(findProductByDateDto);
  }

  @Get()
  findByDate(@Query() searchProductDto : SearProductDto) {
    return this.productService.findAll(searchProductDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
