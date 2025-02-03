/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import {
  UpdateUserDTO,
  UserDTOPage,
  UserDTOResponseId,
  UserFilters,
} from './UserDTO/users.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './UserDTO/Role.enum';
import { RolesGuard } from 'src/Auth/Guard/roles.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

@Get()
//@Roles(Role.admin)
//@UseGuards(RolesGuard)
@SetMetadata("isPublic", true)
@ApiOperation({
  summary: 'Obtiene todos los usuarios',
  description:
    'Este endpoint se encarga de obtener todos los usuarios almacenados en la base de datos y paginarlos.',
})
@ApiBearerAuth()
async getAllUsers(
  @Query('page') page: number,
  @Query('limit') limit: number,
  @Query('name') name?: string,
  @Query('email') email?: string,
  @Query('phone') phone?: string,
  @Query('address') address?: string,
  @Query('dni') dni?: number,
  @Query('userStatus') userStatus?: string,
  @Query('isAdmin') isAdmin?: string,
): Promise<UserDTOPage> {
  if (isNaN(page) || page <= 0) page = 1;
  if (isNaN(limit) || limit <= 0) limit = 5;

  const filters: UserFilters = {
    name,
    email,
    phone,
    address,
    dni,
    userStatus,
    isAdmin,
  };

  return await this.userService.getAllUsers(page, limit, filters);
}

  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene un usuario por id.',
    description:
      'Este endpoint se encarga de obtener un usuario por id atarvez de un uuid valido.',
  })
  @ApiBearerAuth()
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserDTOResponseId> {
    return await this.userService.getUserById(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar usuario.',
    description:
      'Este endpoint ecibe el id del usuario, para buscarlo y luego eliminarlo.',
  })
  @ApiBearerAuth()
  async deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<'Usuario eliminado'> {
    return await this.userService.deleteUser(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Editar usuario.',
    description:
      'Este endpoint recibe el id del usuario, para buscarlo y luego modificarlo con los atribustos mandados.',
  })
  @ApiBearerAuth()
  async editUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() editUser: UpdateUserDTO,
  ): Promise<'Se actualizo el perfil correctamente'> {
    if (!Object.keys(editUser).length)
      throw new BadRequestException('Debe al menos modificar una propiedad.');
    return await this.userService.editUser(id, editUser);
  }
}
