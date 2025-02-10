import { Controller, Get, Query, SetMetadata } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('images')
  @SetMetadata('isPublic', true)
  async getImages() {
    const images = await this.cloudinaryService.getAllImagesFromCloudinary();
    return images;
  }
}
