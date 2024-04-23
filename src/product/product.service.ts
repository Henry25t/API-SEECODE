import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }
  async create( { code, name, price, stock,}: CreateProductDto) {
    try {
      const product = await this.productRepository.create({
        name: name,
        code: code,
        stock: stock,
        price: price
      });
      if(!product){
        throw new NotFoundException(`No se pudo crear ningún producto`);
      }
      await this.productRepository.save(product)
      return{
        ok: true,
        product
      }
    } catch (error) {
      throw new NotFoundException(`${error.message}`)
    }
  }

  async findAll() {
   try {
    const product = await this.productRepository.find()
    if(product.length > 0)
    {
      return{
        ok: true,
        product
      }
    }
    throw new NotFoundException(`Ocurrió un error al obtener los productos`)
   } catch (error) {
    throw new NotFoundException()
   }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({where: {id}})
      if(!product){
        throw new NotFoundException(`No se encontró ningún Producto con el Id ${id}`)
      }
      return{
        ok: true,
        product
      }
    } catch (error) {
      throw new NotFoundException(`No se encontró ningún Producto con el Id ${id}`)
    }
  }

  async update(id: number, { code, name, price, stock}: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOne({where: {id}})

    product.name = name,
    product.code = code,
    product.price = price,
    product.stock = stock

    await this.productRepository.save(product)
    return{
      ok: true,
      product
    }
    } catch (error) {
      throw new NotFoundException(`No se pudo actualizar el registro ${error}`)
    }
  }

  async remove(id: number) {
   try {
    const product = await this.productRepository.delete(id);
    if(product.affected === 0){
      throw new NotFoundException(`No se encontró ningún producto con el id: ${id}`)
    }
    return {
      ok: true, product
    }
   } catch (error) {
    throw new Error(`Ocurrió un error al eliminar el producto con el ID ${id}: ${error.message}`);
   }
  }
}
