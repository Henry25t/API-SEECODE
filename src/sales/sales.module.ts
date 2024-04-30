import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './entities/sale.entity';
import { Client } from 'src/client/entities/client.entity';
import { Product } from 'src/product/entities/product.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { Box } from 'src/box/entities/box.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, Client, Product, DetailSale, Box])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
