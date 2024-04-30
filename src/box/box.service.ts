import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Box } from './entities/box.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BoxService {
  constructor(
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>
  ){}
  async create({ date, start, totalSales}: CreateBoxDto) {
    try {
      const box = await this.boxRepository.save({
        date: date,
        start: start,
        totalSales: totalSales
      })

      return{
        ok: true,
        box: box
      }
    } catch (error) {
      throw new NotFoundException(`No se pudo crear una nueva caja ${error.message}`)
    }
  }

  findAll() {
    return `This action returns all box`;
  }

  findOne(id: number) {
    return `This action returns a #${id} box`;
  }

  update(id: number, updateBoxDto: UpdateBoxDto) {
    return `This action updates a #${id} box`;
  }

  remove(id: number) {
    return `This action removes a #${id} box`;
  }
}
