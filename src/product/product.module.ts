import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from 'src/category/entities/category.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Sale, DetailSale])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
