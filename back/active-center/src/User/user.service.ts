/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/Entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  UpdateUserDTO,
  UserDTOPage,
  UserDTOREsponseGet,
  UserDTOResponseId,
  UserStatus,
} from './UserDTO/users.dto';
import { SALT } from 'src/config/config.envs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getAllUsers(page: number, limit: number): Promise<UserDTOPage> {
    try {
      const users: User[] = await this.userRepository.find();

      if (!users) throw new NotFoundException('No sé encontro ningún usuario');

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
    }
  }

  async getUserById(id: string): Promise<UserDTOResponseId> {
    try {
      const user: User | null = await this.userRepository.findOne({
        where: { id },
        relations: ['orders', 'reservations', 'activities'],
      });
      if (!user) throw new NotFoundException('El usuario buscado no existe.');
      const { password, updateUser, isAdmin, createUser, ...partialUser } =
        user;
      return partialUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ email });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteUser(id: string): Promise<'Usuario eliminado'> {
    try {
      const exist: User | null = await this.userRepository.findOneBy({ id });
      if (!exist) throw new NotFoundException('El usuario buscado, no existe.');
      await this.userRepository.save({
        ...exist,
        userStatus: UserStatus.delete,
        updateUser: new Date(),
      });
      return 'Usuario eliminado';
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo algun error al eliminar el usuario. Intentelo más tarde.',
      );
    }
  }

  async editUser(
    id: string,
    editUser: UpdateUserDTO,
  ): Promise<'Se actualizo el perfil correctamente'> {
    try {
      const oldUser: User | null = await this.userRepository.findOneBy({ id });
      if (!oldUser) throw new BadRequestException('No existe el usuario.');
      if (editUser.password) {
        const password: string = await this.hashPassword(editUser.password);
        await this.userRepository.save({
          ...oldUser,
          ...editUser,
          password,
          updateUser: new Date(),
        });
        return 'Se actualizo el perfil correctamente';
      }
      await this.userRepository.save({
        ...oldUser,
        ...editUser,
        updateUser: new Date(),
      });
      return 'Se actualizo el perfil correctamente';
    } catch (error) {
      throw new Error(error);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      if (!SALT || isNaN(SALT))
        throw new BadRequestException('El salto de hasheo debe ser un numero');
      const salt: string = await bcrypt.genSalt(SALT);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      const errorMessage: string =
        error instanceof Error ? error.message : 'Hubo un error desconocido.';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
