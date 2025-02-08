import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from 'src/Entities/Space.entity';
import espacios from 'src/Reservation/Espacios';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class SpaceService {
    constructor(
    @InjectRepository(Space) private spaceRepository: Repository<Space>,
    private cloudinaryService:CloudinaryService  
  ) {}

  async createSpaces(spaces: CreateSpaceDto, file?: Express.Multer.File): Promise<Space> {
    let imageUrl: string | undefined;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadImage(file);
    }
  
    const newSpace = this.spaceRepository.create({
      title: spaces.title,
      img: imageUrl ? [imageUrl] : [],  
      description: spaces.description,
      details: spaces.details,
      characteristics: spaces.characteristics,
      price_hour: spaces.price_hour,
      status: spaces.status ?? true,
    });
  
    return await this.spaceRepository.save(newSpace);
  }
  

  async getSpaceById(spaceId: string) {
    try {
      const space = await this.spaceRepository.findOne({
        where: { id: spaceId },
      });
      if(!space) throw new NotFoundException('No existe el espacio.');
      return space;
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Hubo un error al obtener el espacio. Error: ${error.message}`);
    };
  }

  async getSpaceByName(name: string) {
    try {
      const spaceName = await this.spaceRepository.findOne({
        where: { title: name },
      });
      if(!spaceName) throw new NotFoundException('No se encontro ningun espacio con este nombre.');
      return spaceName;
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Hubo un error al obtener el espacio. Error: ${error.message}`);
    }
  }

  async getAllSpace(page: number, limit: number): Promise<Space[]> {
    try {
      const spaces: Space[] = await this.spaceRepository.find({});
      if(!spaces) throw new NotFoundException('Lo lamentamos no hay espacios aun.');
      const start = (page - 1) * limit;
      const end = start + limit;
      return spaces.slice(start, end);
    } catch (error) {
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al obtener los espacios.',
      );
    }
  }

  async addSpace() {
    
    const existSpace = (await this.spaceRepository.find()).map(
      (space) => space.title,
    );
    for (const spaceData of espacios) {
      if (!existSpace.includes(spaceData.title)) {
        const newSpace = this.spaceRepository.create({
          title: spaceData.title,
          description: spaceData.descripcion,
          price_hour: spaceData.price_hours,
          details: spaceData.details,
          characteristics: spaceData.characteristics,
          status: spaceData.status,
        });
        await this.spaceRepository.save(newSpace);
      }
    }
  }
}