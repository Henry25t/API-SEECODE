import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from 'buffer';
import { Files } from './entities/file.entity';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import path from 'path';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files)
    private readonly fileRepository: Repository<Files>
  ) { }
  async upload(file: Express.Multer.File): Promise<Files> {
    try {
      const newFile = this.fileRepository.create({
        fileName: file.filename,
        path: file.path,
      });
      const savedFile = await this.fileRepository.save(newFile);
      return savedFile;

    } catch (error) {
      // Manejar errores
    }
  }

  create(createDto: CreateFileDto) {
    return 'This action adds a new file';
  }

  findAll() {
    return `This action returns all file`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: UpdateFileDto) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
