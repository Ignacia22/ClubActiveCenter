/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserDTOPage, UserDtoREsponseGet, UserDTOResponseId } from './UsersDTO/User.dto';
import { User } from 'src/Entities/User.entity';

@Injectable()
export class UserService {
  constructor(private userRepo: UserRepository) {}
  async getAllUsers(
    page: number,
    limit: number,
  ): Promise<UserDTOPage> {
    const users: User[] = await this.userRepo.getAllUsers();
    
    const partialUsers: UserDtoREsponseGet[] = users.map((user) => {
      const { password, ...partialUser } = user;
      return partialUser;
    });

    const totalItems: number = users.length;
    const maxPages: number = Math.ceil(totalItems / limit);
    const currentPage: number = Math.min(Math.max(1, page), maxPages);
    const init: number = (currentPage - 1) * limit;
    const end: number = Math.min(currentPage * limit, totalItems);
    const getUsers: UserDtoREsponseGet[] = partialUsers.slice(init, end);

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
  }

  async getUserById(id: string): Promise<UserDTOResponseId> {
    const user: User = await this.userRepo.getUserById(id);
    const { password, updateUser, isAdmin, createUser, ...partialUser } = user;
    return partialUser;
  }
}
