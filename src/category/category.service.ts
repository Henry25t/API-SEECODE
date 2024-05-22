import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Like, Repository } from 'typeorm';
import { SearchCategoryDto } from './dto/search-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>
  ) { }
  async create({ name }: CreateCategoryDto) {
    try {
      const category = await this.categoryRepository.create({ name: name })
      if (category) {
        await this.categoryRepository.save(category)
        return {
          ok: true,
          category,
          status: HttpStatus.CREATED
        }
      }
      return {
        ok: false,
        message: "Datos validos",
        status: HttpStatus.CONFLICT
      }
    } catch (error) {
      throw new NotFoundException("Error en el servidor" + error.message),
      HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  async findAll({ limit, name, page} : SearchCategoryDto) {
    try {
      const [category, total] = await this.categoryRepository.findAndCount({
        where: {
          name: Like(`%${name}%`),
          isActive: true
        },
        order: { id: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      console.log(category)
      if (category.length > 0) {
        let totalPag: number = total / limit;
        if (totalPag % 1 != 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        let nextPag: number = page >= totalPag ? page : Number(page) + 1;
        let prevPag: number = page <= 1 ? page : page - 1;
        return {
          ok: true,
          category,
          total,
          totalPag,
          currentPage: Number(page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
      return {
        ok: false, message: "User not found", status: HttpStatus.NOT_FOUND
      }

    } catch (error) {
      throw new NotFoundException(`Ocurrió un erro ${error.message}`)
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoryRepository.findOne({where: {id, isActive: true}})
      if(category.id > 0){
        return{
          ok: true,
          category,
          status: HttpStatus.OK
        }
      }
      return{
        ok: false,
        message: "Not found",
        status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      throw new NotFoundException("Ocurrio un error" + error.message),
      HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  async update(id: number, { name}: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({where: {id, isActive: true}})
      if(category){
        category.name = name
        await this.categoryRepository.save(category)
        return{
          ok: true,
          category,
          status: HttpStatus.OK
        }
      }
      return{
        ok: false,
        message: "Not found",
        status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      throw new NotFoundException("Ocurrio un error" + error.message),
      HttpStatus.INTERNAL_SERVER_ERROR
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoryRepository.findOne({where: {id, isActive: true}})
      if(category){
        category.isActive = false
        await this.categoryRepository.save(category)
        return{
          ok: true,
          message: "removed success",
          status: HttpStatus.OK
        }
      }
      return{
        ok: false,
        message: "not found",
        status: HttpStatus.NOT_FOUND
      }
    } catch (error) {
      throw new NotFoundException("Ocurrio un error" + error.message),
      HttpStatus.INTERNAL_SERVER_ERROR
    }
  }
}
