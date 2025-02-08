import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryConfig } from 'src/config/cloudinary';
import { CloudinaryController } from './cloudinary.controller';

@Module({
  providers: [CloudinaryService, CloudinaryConfig],
  controllers: [CloudinaryController],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
