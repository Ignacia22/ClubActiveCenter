import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import * as fs from 'fs';

interface CloudinaryImage {
  secure_url: string;
  public_id: string;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY') private readonly cloudinaryService: typeof cloudinary,
  ) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          },
        );

        Readable.from(file.buffer).pipe(uploadStream);
      });

      return (result as any).secure_url;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al subir la imagen: ${error.message}`,
      );
    }
  }

  async getAllImagesFromCloudinary(): Promise<any[]> {
    try {
      let imagesData: any[] = [];
      let nextCursor: string | null = null;

      // Si no estás seguro del prefijo, puedes obtener todas las imágenes en tu cuenta
      do {
        const result = await cloudinary.api.resources({
          type: 'upload',
          next_cursor: nextCursor, // Paginación
        });

        imagesData = [
          ...imagesData,
          ...result.resources.map((img: any) => ({
            asset_id: img.asset_id,
            public_id: img.public_id,
            display_name: img.display_name,
            url: img.url,
          })),
        ];

        nextCursor = result.next_cursor; // Paginación
      } while (nextCursor); // Continuar hasta obtener todas las imágenes

      return imagesData;
    } catch (error) {
      console.error('Error obteniendo imágenes:', error);
      return [];
    }
  }
}
