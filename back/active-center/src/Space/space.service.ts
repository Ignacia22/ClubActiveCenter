import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from 'src/Entities/Space.entity';
import espacios from 'src/Reservation/Espacios';

@Injectable()
export class SpaceService {

  constructor(@InjectRepository(Space) private spaceRepository:Repository<Space>){}

  async getSpaceById(spaceId:string){
    const space = await this.spaceRepository.findOne({where:{id:spaceId}})
    return space;
  }

  async getSpaceByName(name:string){
    const spaceName = await this.spaceRepository.findOne({where:{title:name}})
    return spaceName;
  }


  async addSpace(){

      const existSpace = (await this.spaceRepository.find()).map((space) => space.title)
      for(const spaceData of espacios){
       if(!existSpace.includes(spaceData.title)){

           const newSpace = this.spaceRepository.create({
             title : spaceData.title,
             description : spaceData.descripcion,
             price_hour : spaceData.price_hours,
             details: spaceData.details,
             characteristics: spaceData.characteristics,
             status : spaceData.status,
           })
            await this.spaceRepository.save(newSpace)
       }
      } 
   }

  }

  


