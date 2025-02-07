/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Headers,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  RegisterUserDTO,
  SignInUserDTO,
  UserDTOResponse,
  UserDTOResponseId,
} from 'src/User/UserDTO/users.dto';
import {
  BanDTOResponse,
  LoginDTO,
  RefreshTokenDTO,
  SingInDTOResponse,
} from './AuthDTO/auths.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/User/UserDTO/Role.enum';
import { RolesGuard } from './Guard/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignUp')
  @ApiOperation({
    summary: 'Registro de nuevo usuario',
    description:
      'Este endpoint permite registrar un nuevo usuario en el sistema, creando su cuenta con los datos proporcionados (nombre, correo, contraseña, etc.). Se validan los datos y se crea un usuario en la base de datos.',
  })
  @SetMetadata('isPublic', true)
  async SignUp(@Body() user: RegisterUserDTO): Promise<UserDTOResponse> {
    const { passwordConfirmation, ...partialUser } = user;
    return await this.authService.SignUp(partialUser);
  }

  @Post('SignIn')
  @ApiOperation({
    summary: 'Iniciar sesión de usuario',
    description:
      'Este endpoint permite a los usuarios autenticarse en el sistema proporcionando su correo electrónico y contraseña. Si las credenciales son válidas, se genera un token JWT para la sesión y devuelve cierta información.',
  })
  @SetMetadata('isPublic', true)
  async SignIn(@Body() user: SignInUserDTO): Promise<SingInDTOResponse> {
    return await this.authService.SignIn(user);
  }

  @Put('tokenRefresh')
  @ApiOperation({
    summary: 'Actualizar un token a partir del original.',
    description:
      'Este endpoint permite actualizar un token para poder seguir conectado sin la necesidad de volver iniciar sesión cuando el token se expire.',
  })
  @ApiBearerAuth()
  async tokenRefresh(
    @Headers('authorization') token: string,
  ): Promise<RefreshTokenDTO> {
    const tokenBearer: string[] = token.split(' ');
    if (!tokenBearer[1]) throw new UnauthorizedException('Token invalido');
    if (!tokenBearer[0])
      throw new UnauthorizedException('Formato de token invalido.');
    return await this.authService.tokenRefresh(tokenBearer[1]);
  }

  @Delete(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Banear o desbanear un usuario (ADMIN)',
    description:
      'Este endpoint permite banear a un usuario, buscando al usuaurio por su id y luego baneandolo y en caso que ya lo este, poder desbanearlo. Solo para administradores.',
  })
  async isBan(@Param('id', ParseUUIDPipe) id: string): Promise<BanDTOResponse> {
    return await this.authService.isBan(id);
  }

  @Put('Log-out/:id')
  @ApiBearerAuth()
  @ApiOperation({
    description:
      'Este endpoint actauliza el estado de un usuario a desconectado.',
    summary: 'Desconectar a un usuario.',
  })
  async LogOut(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<'Te has desconectado.'> {
    return await this.authService.LogOut(id);
  }

  @Put(':id')
  @Roles(Role.admin)
  @UseGuards(RolesGuard)
  @ApiOperation({
    description:
      'Este endpoint actualiza el rol del usurio, convirtiendolo en administrador o quitandole el administrador.',
    summary: 'Dar o quitar administrador. (ADMIN)',
  })
  @ApiBearerAuth()
  async isAdmin(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<BanDTOResponse> {
    return await this.authService.isAdmin(id);
  }

  @Post('login')
  @SetMetadata('isPublic', true)
  @ApiOperation({
    description:
      'Este endpoint permite validar a un usuario solo por email. Esta ruta esta hecha para el uso de auth0.',
    summary: 'sign in con auth0.',
  })
  async login(@Body() email: LoginDTO): Promise<SingInDTOResponse> {
    return await this.authService.login(email);
  }
}
