import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { Between, In, Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SearProductDto } from './dto/search-product.dto';
import { Category } from 'src/category/entities/category.entity';
import { FindProductByDateDto } from './dto/findByDate-product';
import { Sale } from 'src/sales/entities/sale.entity';
import { DetailSale } from 'src/detail-sale/entities/detail-sale.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Sale)
    private readonly saleRepository: Repository<Sale>,
    @InjectRepository(DetailSale)
    private readonly detailsSaleRepository: Repository<DetailSale>
  ) { }
  async create( { code, name, price, stock, categoryId}: CreateProductDto) {
    try {
      const category = await this.categoryRepository.findOne({where: {id: categoryId, isActive: true}})
      const product = await this.productRepository.create({
        name: name,
        code: code,
        stock: stock,
        price: price,
        category: category
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
      relations: {category: true},
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
      const product = await this.productRepository.findOne({where: {id}, relations: {category: true}})
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

  async update(id: number, { code, name, price, stock, categoryId}: UpdateProductDto) {
    try {
      const category = await this.categoryRepository.findOne({where: {id: categoryId}})
      const product = await this.productRepository.findOne({where: {id}})

    product.name = name,
    product.code = code,
    product.price = price,
    product.stock = stock,
    product.category = category,

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

  async findByDate({ endDate, initialDate}: FindProductByDateDto){
    try {
      const saleDate = await this.saleRepository.find({
        where: {
          date : Between(initialDate as unknown as Date, endDate as unknown as Date),
        },
      });

      const salesDateIds = saleDate.map(sales=> sales.id)
  
      const productByDate = await this.detailsSaleRepository.find({
        where: { sale: In(salesDateIds)},
        relations: {product: true}
      })
  
      let productDetails = [];
    for (const pro of productByDate) {
      if (pro.product) {
        let existingProduct = productDetails.find(item => item.name === pro.product.name);

        if (existingProduct) {
          existingProduct.cantidad += pro.cantidad || 0;
          existingProduct.total += pro.total || 0;
        } else {
          productDetails.push({
            name: pro.product.name,
            cantidad: pro.cantidad || 0,
            total: pro.total || 0
          });
        }
      }
    }
      return{
        ok: true,
        productDetails,
        status: HttpStatus.OK
      }
    } catch (error) {
      return{
        ok: false,
        message: "Error en el servidor" + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}
