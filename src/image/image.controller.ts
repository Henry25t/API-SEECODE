import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameImage } from './helpers/imageges.helper';
import { ok } from 'assert';

@Controller('image')
export class ImageController {

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // uploadFile(@UploadedFile() file: Express.Multer.File){
  //   console.log(file);
  // }
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './upload',
      filename: renameImage
    }),
    fileFilter: fileFilter
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File){
    console.log(file);
    return{
      ok: true,
      status: HttpStatus.OK
    }
  }
}
