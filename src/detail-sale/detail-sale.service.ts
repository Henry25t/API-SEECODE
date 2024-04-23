import { Injectable, NotAcceptableException } from '@nestjs/common';
import { CreateDetailSaleDto } from './dto/create-detail-sale.dto';
import { UpdateDetailSaleDto } from './dto/update-detail-sale.dto';
import { Repository } from 'typeorm';
import { DetailSale } from './entities/detail-sale.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class DetailSaleService {
  constructor(
    @InjectRepository(DetailSale)
    private readonly detailSaleRepository: Repository<DetailSale>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
  ) { }
  async create({ productId, cantidad, total, saleId }: CreateDetailSaleDto) {
    try {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      const sale = await this.saleRepository.findOne({ where: { id: saleId } });
      const detailSale = await this.detailSaleRepository.create({
        product: product,
        cantidad: cantidad,
        total: total,
        sale: sale
      })
      return {
        ok: true,
        detailSale
      }
    } catch (error) {
      throw new NotAcceptableException(`No se pudo crear el detalle de venta`)
    }
  }

  findAll() {
    return `This action returns all detailSale`;
  }

  findOne(id: number) {
    return `This action returns a #${id} detailSale`;
  }

  update(id: number, updateDetailSaleDto: UpdateDetailSaleDto) {
    return `This action updates a #${id} detailSale`;
  }

  remove(id: number) {
    return `This action removes a #${id} detailSale`;
  }
}
