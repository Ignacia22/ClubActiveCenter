import { Injectable } from '@nestjs/common';
import { CreateSpaceDto } from './dto/create-space.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Space } from 'src/Entities/Space.entity';
import espacios from 'src/Reservation/DB-ESPACIOS';

@Injectable()
export class SpaceService {

  constructor(@InjectRepository(Space) private spaceRepository:Repository<Space>){}

  async getSpaceById(spaceId:string){
    const space = await this.spaceRepository.findOne({where:{id:spaceId}})
    return space;
  }

  async addSpace(){

      const existSpace = (await this.spaceRepository.find()).map((space) => space.title)
      for(const spaceData of espacios){
       if(!existSpace.includes(spaceData.title)){

           const newSpace = this.spaceRepository.create({
             title : spaceData.title,
             description : spaceData.descripcion,
             price_hour : spaceData.price_hours,
             status : spaceData.status,
           })
            await this.spaceRepository.save(newSpace)
       }
      } 
   }

  }

  


