/* eslint-disable prettier/prettier */
import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { UserDTOPage, UserDTOResponseId } from './UserDTO/users.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Obtiene todos los usuarios',
    description:
      'Este endpoint se encarga de obtener todos los usuarios almacenados en la base de datos y paginarlos.',
  })
  async getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ): Promise<UserDTOPage> {
    if (isNaN(page) || page <= 0) page = 1;
    if (isNaN(limit) || limit <= 0) limit = 5;
    return await this.userService.getAllUsers(page, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un usuario por id.',
    description:
      'Este endpoint se encarga de obtener un usuario por id atarvez de un uuid valido.',
  })
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDTOResponseId> {
    return await this.userService.getUserById(id);
  }
}
