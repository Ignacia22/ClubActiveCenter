/* eslint-disable prettier/prettier */
import { Controller, Headers, Post, Put, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDTO, SignInUserDTO, UserDTOResponseId } from 'src/User/UserDTO/users.dto';
import { SingInDTOResponse } from './AuthDTO/auths.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('SignUp')
  async SignUp (user: RegisterUserDTO): Promise<UserDTOResponseId> {
    return await this.authService.SignUp(user);
  }

  @Post('SignIn')
  async SignIn (user: SignInUserDTO): Promise<SingInDTOResponse> {
    return await this.authService.SignIn(user);
  }

  @Put('tokenRefresh')
  async tokenRefresh(@Headers('authorization') token: string): Promise<any>{
    const tokenBearer: string[] = token.split(' ');
    if(!tokenBearer[1]) throw new UnauthorizedException("Token invalido");
    if(!tokenBearer[0]) throw new UnauthorizedException("Formato de token invalido.");
    return await this.authService.tokenRefresh(tokenBearer[1]);
  }
}
