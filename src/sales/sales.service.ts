import { HttpStatus, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Sale } from './entities/sale.entity';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/client/entities/client.entity';
import { Product } from 'src/product/entities/product.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';
import { Box } from 'src/box/entities/box.entity';
import { FindByDateDto } from './dto/findByDate-sale.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(DetailSale)
    private readonly detailSaleRepository: Repository<DetailSale>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) { }
  async create({ date, total, clientId, products, boxId }: CreateSaleDto) {
    try {

      const box = await this.boxRepository.findOne({ where: { id: boxId, isActive: true } })
      const client = await this.clientRepository.findOne({ where: { id: clientId, isActive: true } });

      if (!box) {
        throw new NotFoundException(`No hay caja abierta con el Id: ${boxId}`);
      }

      if (!client) {
        throw new NotFoundException(`Cliente con ID ${clientId} no encontrado.`);
      } else if (!products) {
        throw new NotFoundException(`Producto con ID ${products} no encontrado.`);
      }



      const newSale = new Sale();
      newSale.date = date as unknown as Date;
      newSale.total = total;
      newSale.client = client;
      newSale.box = box;


      const savedSale = await this.saleRepository.save(newSale);

      let totalPro = 0;

      for (const pro of products) {
        const product = await this.productRepository.findOne({ where: { id: pro.productId, isActive: true } });

        const detailSale = new DetailSale();
        detailSale.product = product;
        detailSale.cantidad = pro.cantidad
        detailSale.total = product.price * pro.cantidad;
        detailSale.sale = savedSale;

        totalPro += detailSale.total

        await this.detailSaleRepository.save(detailSale);

        if (product.stock >= pro.cantidad) {
          product.stock -= pro.cantidad;
        } else {
          throw new NotFoundException(`stock insuficiente para hacer una venta del producto ${product.name}`)
        }

        await this.productRepository.save(product);

        newSale.total = totalPro
        await this.saleRepository.save(newSale)
      }
      client.points += totalPro
      await this.clientRepository.save(client)

      box.totalSales += totalPro
      await this.boxRepository.save(box)

      return {
        ok: true,
        sale: savedSale,
      };
    } catch (error) {
      throw new NotAcceptableException(`No se pudo crear la venta: ${error.message}`);
    }
  }

  async createQueryRunner({ date, total, clientId, products, boxId }: CreateSaleDto) {
    const queryRunner = this.saleRepository.manager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const box = await queryRunner.manager.findOne(Box, { where: { id: boxId, isActive: true } });
      const client = await queryRunner.manager.findOne(Client, { where: { id: clientId, isActive: true } });

      if (!box) {
        throw new NotFoundException(`No hay caja abierta con el Id: ${boxId}`);
      }

      if (!client) {
        throw new NotFoundException(`Cliente con ID ${clientId} no encontrado.`);
      } else if (!products) {
        throw new NotFoundException(`Producto con ID ${products} no encontrado.`);
      }

      const newSale = new Sale();
      newSale.date = date as unknown as Date;
      newSale.total = total;
      newSale.client = client;
      newSale.box = box;

      const savedSale = await queryRunner.manager.save(Sale, newSale);

      let totalPro = 0;

      for (const pro of products) {
        const product = await queryRunner.manager.findOne(Product, { where: { id: pro.productId, isActive: true } });
        if(!product || product.isActive === false){
          throw new NotAcceptableException(`no se encontró el producto con el id: ${pro.productId}`)
        }

        const detailSale = new DetailSale();
        detailSale.product = product;
        detailSale.cantidad = pro.cantidad;
        detailSale.total = product.price * pro.cantidad;
        detailSale.sale = savedSale;

        totalPro += detailSale.total;

        await queryRunner.manager.save(DetailSale, detailSale);

        if (product.stock >= pro.cantidad) {
          product.stock -= pro.cantidad;
        } else {
          throw new NotFoundException(`stock insuficiente para hacer una venta del producto ${product.name}`);
        }

        await queryRunner.manager.save(Product, product);
      }
      client.points += totalPro;
      await queryRunner.manager.save(Client, client);

      box.totalSales += totalPro;
      await queryRunner.manager.save(Box, box);
      
      savedSale.total += totalPro;
      await queryRunner.manager.save(Sale, savedSale);

      await queryRunner.commitTransaction();

      return {
        ok: true,
        sale: savedSale,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new NotAcceptableException(`No se pudo crear la venta,  ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      const sales = await this.saleRepository.find({ relations: ['client'] });
      if (sales.length > 0) {
        return {
          ok: true,
          sales
        }
      }
    } catch (error) {
      throw new NotFoundException(`Ocurrió un error al obtener las ventas`)
    }
  }

  async findOne(id: number) {
    try {
      const searchSales = await this.saleRepository.findOne({ where: { id }, relations: ['client'] })
      if (!searchSales) {
        throw new NotFoundException(`No se encontró ningún registro con el id ${id}`)
      }
      const sales = {
        id: searchSales.id,
        date: searchSales.date,
        total: searchSales.total,
        client: searchSales.client,
        clientId: searchSales.clientId
      }
      return {
        ok: true,
        sales
      }
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }

  async update(id: number, { date, total, clientId }: UpdateSaleDto) {
    try {
      const sales = await this.saleRepository.findOne({ where: { id } })
      const client = await this.clientRepository.findOne({ where: { id: clientId } });
      const date2: Date = new Date(date);
      sales.date = date2,
        sales.total = total,
        sales.client = client

      await this.saleRepository.save(sales)
      return {
        ok: true,
        sales
      }
    } catch (error) {
      throw new NotFoundException(`No se pudo actualizar el registro`)
    }
  }

  async remove(id: number) {
    try {
      const result = await this.saleRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`No se encontró ningún Venta con el ID ${id}`);
      }
      return { ok: true, result, }
    } catch (error) {
      throw new Error(`Ocurrió un error al eliminar el Venta con el ID ${id}: ${error.message}`);
    }
  }

  async findByDate({ endDate, initialDate}: FindByDateDto){
    const sales = await this.saleRepository.find({
      where: {
        date: Between(initialDate as unknown as Date, endDate as unknown as Date),
      },
    });

    const date = sales.map(sale => ({
      date: sale.date,
      total: sale.total,
    }));

    return{
      ok: true,
      date,
      status: HttpStatus.OK
    }

  }
}
