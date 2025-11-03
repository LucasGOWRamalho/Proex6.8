import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name',
      api_key: process.env.CLOUDINARY_API_KEY || 'your_api_key',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'your_api_secret',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'colony_app',
          transformation: [
            { width: 1200, height: 800, crop: 'limit' },
            { quality: 'auto' },
            { format: 'webp' }, // Converte para WebP para melhor performance
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            if (!result) {
              reject(new Error('No result returned from Cloudinary'));
              return;
            }
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
            });
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      throw new Error('Não foi possível deletar o arquivo');
    }
  }

  async uploadFromUrl(imageUrl: string): Promise<{ url: string; publicId: string }> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        folder: 'colony_app',
        resource_type: 'image',
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      throw new Error('Não foi possível fazer upload da URL');
    }
  }
}