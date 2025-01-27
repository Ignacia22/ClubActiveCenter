/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { User } from 'src/Entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDTOPage, UserDTOREsponseGet, UserDTOResponseId } from './UserDTO/users.dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<UserDTOPage> {
    try {
      const users: User[] = await this.userRepository.find();
    
      if(!users) throw new NotFoundException('No sé encontro ningún usuario');
      
      const partialUsers: UserDTOREsponseGet[] = users.map((user) => {
        const { password, ...partialUser } = user;
        return partialUser;
      });
  
      const totalItems: number = users.length;
      const maxPages: number = Math.ceil(totalItems / limit);
      const currentPage: number = Math.min(Math.max(1, page), maxPages);
      const init: number = (currentPage - 1) * limit;
      const end: number = Math.min(currentPage * limit, totalItems);
      const getUsers: UserDTOREsponseGet[] = partialUsers.slice(init, end);
  
      const Page: UserDTOPage = {
        infoPage: {
          totalItems,
          maxPages,
          page: currentPage,
          currentUsers: getUsers.length,
        },
        users: getUsers,
      };
  
      return Page;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }

  async getUserById(id: string): Promise<UserDTOResponseId> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('El usuario buscado no existe.');
      const { password, updateUser, isAdmin, createUser, ...partialUser } = user;
      return partialUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user: User | null = await this.userRepository.findOneBy({email});
      if(!user) throw new NotFoundException('Mail o contraseña incorrecta.');
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    };
  }
}
