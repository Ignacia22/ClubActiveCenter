import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary'; 

@Injectable()
export class CloudinaryService {
    constructor(
        @Inject("CLOUDINARY") private readonly clodinaryService: typeof cloudinary
    ){}

    async uploadImageFromUrl(imageUrl: string): Promise<string> {
        try {
          const result = await cloudinary.uploader.upload(imageUrl, {
            resource_type: 'auto',
          });
    
          return result.secure_url;
        } catch (error) {
          throw new InternalServerErrorException(`Error al subir la imagen desde la URL: ${error.message}`);
        }
      }

      
}
