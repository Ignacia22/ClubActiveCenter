/* eslint-disable prettier/prettier */
import { Body, Controller, Headers, Post, Put, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, SignInUserDTO, UserDTOResponseId } from 'src/User/UserDTO/users.dto';
import { RefreshTokenDTO, SingInDTOResponse } from './AuthDTO/auths.dto';
import { ApiOperation } from '@nestjs/swagger';

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
  async SignUp (@Body() user: RegisterUserDTO): Promise<UserDTOResponseId> {
    return await this.authService.SignUp(user);
  }

  @Post('SignIn')
  @ApiOperation({
    summary: 'Iniciar sesión de usuario',
    description:
      'Este endpoint permite a los usuarios autenticarse en el sistema proporcionando su correo electrónico y contraseña. Si las credenciales son válidas, se genera un token JWT para la sesión.',
  })
  @SetMetadata('isPublic', true)
  async SignIn (@Body() user: SignInUserDTO): Promise<SingInDTOResponse> {
    return await this.authService.SignIn(user);
  }

  @Put('tokenRefresh')
  @SetMetadata('isPublic', true)
  @ApiOperation({
    summary: 'Actualizar un token a partir del original.',
    description: 'Este endpoint permite actualizar un token para poder seguir conectado sin la necesidad de volver iniciar sesión cuando el token se expire.',
  })
  async tokenRefresh(@Headers('authorization') token: string): Promise<RefreshTokenDTO>{
    const tokenBearer: string[] = token.split(' ');
    if(!tokenBearer[1]) throw new UnauthorizedException("Token invalido");
    if(!tokenBearer[0]) throw new UnauthorizedException("Formato de token invalido.");
    return await this.authService.tokenRefresh(tokenBearer[1]);
  }
}
