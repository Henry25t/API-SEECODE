import { Injectable } from '@nestjs/common';
import { v2 as Cloudinary } from 'cloudinary';

Cloudinary.config({
  cloud_name: 'davat3lak',
  api_key: '883883283968626',
  api_secret: 'Auku68vQBLKfro9whT7uwW0bf9E',
});

@Injectable()
export class ImageService {
  async uploadImageToCloudinary(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      Cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }).end(file.buffer);
    });
  }
}
