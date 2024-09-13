import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, Param, Get, Res, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameImage } from './helpers/imageges.helper';
import { join } from 'path';
import { readdirSync } from 'fs';
import { elementAt } from 'rxjs';
import { json } from 'stream/consumers';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';

@Controller('image')
export class ImageController {

  constructor(private readonly cloudinaryService: ImageService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))  // 'file' es el nombre del campo que recibirá la imagen
  async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() createImageDto : CreateImageDto) {
    const result = await this.cloudinaryService.uploadImageToCloudinary(file, createImageDto);
    return {
      message: 'Image uploaded successfully',
      url: result.secure_url, // URL de la imagen subida
    };
  }
  /*@Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: renameImage
    }),
    fileFilter: fileFilter
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return {
      ok: true,
      status: HttpStatus.OK
    }
  }*/

  @Get('all')
  getAllImages() {
    try {
      const uploadPath = join(process.cwd(), 'upload');
      const images = readdirSync(uploadPath);
      const imagePaths = images.map(image => `/images/${image}`);
      return {
        ok: true,
        imagePaths,
        status: HttpStatus.OK
      };
    } catch (error) {
      return{
        ok: false,
        message: "Ocurio un eroo" + error.message,
        status: HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
  }
}