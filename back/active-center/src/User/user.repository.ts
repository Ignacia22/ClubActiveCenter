/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRepository {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getAllUsers(): Promise<User[]> {
    const user: User[] = await this.userRepository.find();
    if(!user) throw new NotFoundException('No sé encontro ningún usuario');
    return user; 
  }

  async getUserById(id: string): Promise<User> {
    const user: User | null = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('El usuario buscado no existe.');
    return user;
  }
}
