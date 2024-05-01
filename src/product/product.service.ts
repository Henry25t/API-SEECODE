import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError } from 'rxjs';
import { SearProductDto } from './dto/search-product.dto';

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

  async findAll({ name, code, limit, page}: SearProductDto) {
   try {
    const [products, total] = await this.productRepository.findAndCount({
      where: {
        name: Like(`%${name}%`),
        code: Like(`%${code}%`),
        isActive: true
      },
      order: { id: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    console.log(products)
    if (products.length > 0) {
      let totalPag: number = total / limit;
      if (totalPag % 1 != 0) {
        totalPag = Math.trunc(totalPag) + 1;
      }
      let nextPag: number = page >= totalPag ? page : Number(page) + 1;
      let prevPag: number = page <= 1 ? page : page - 1;
      return {
        ok: true,
        products,
        total,
        totalPag,
        currentPage: Number(page),
        nextPag,
        prevPag,
        status: HttpStatus.OK,
      };
    }
    return {
      ok: false, message: "Products not found", status: HttpStatus.NOT_FOUND
    }
   } catch (error) {
    return{
      ok: false,
      message: "Ocurrió un error",
      status: HttpStatus.INTERNAL_SERVER_ERROR
    }
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
