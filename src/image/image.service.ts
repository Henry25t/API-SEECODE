import { Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import { CreateImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';

dotenv.config();
Cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Injectable()
export class ImageService{
  constructor( 
    @InjectRepository(Image) 
    private readonly imageRepository: Repository<Image>
  ){}
  async uploadImageToCloudinary(file: Express.Multer.File, {title} : CreateImageDto): Promise<any> {
    const url = await new Promise((resolve, reject) => {
      Cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });


    const createImageDto = await this.imageRepository.create({
      title,
      url: url['secure_url'],
      public_id: url['public_id'],
    });
    await this.imageRepository.save(createImageDto);

    return{
      message: 'Image uploaded successfully', 
      url: url['secure_url'],
      public_id: url['public_id'],
      status: 200
    }
  }
}
