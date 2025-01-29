/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SALT, SECRET_SECRET_WORD } from 'src/config/config.envs';
import { User } from 'src/Entities/User.entity';
import { UserService } from 'src/User/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDTO, SignInUserDTO, UserDTOResponseId, UserStatus } from 'src/User/UserDTO/users.dto';
import { RefreshTokenDTO, SingInDTOResponse, TokenRefreshPayloadDTO } from './AuthDTO/auths.dto';
import { SendGridService } from 'src/sendGrid/sendGrid.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService, 
    @InjectRepository(User) private userRepository: Repository<User>, 
    private readonly jwtService: JwtService,
    private readonly sendGridService: SendGridService
  ) {}

  async hashPassword (password:string): Promise<string> {
    try {
      if(!SALT || isNaN(SALT)) throw new BadRequestException('El salto de hasheo debe ser un numero');
      const salt: string = await bcrypt.genSalt(SALT);
      return await bcrypt.hash(password, salt);
    } catch (error) {
      const errorMessage: string = error instanceof Error ? error.message : 'Hubo un error desconocido.';
      throw new InternalServerErrorException(errorMessage);
    }
  }

  async SignUp(user: RegisterUserDTO): Promise<UserDTOResponseId>{
    try {
      user.password = await this.hashPassword(user.password);
      const registerUser: User = await this.userRepository.save(user);
      const {updateUser, isAdmin, createUser, orders, reservations, password, ...partialUser} = registerUser;
      const { email }: { email: string } = user;  
      
      this.sendGridService.wellcomeMail(email);

      return partialUser;
    } catch (error) {
      throw new HttpException({
        message: `Hubo un error al registrar al usuario: ${error}`,
        status: 402
      }, 402)
    }
  }

  async SignIn(user: SignInUserDTO): Promise<SingInDTOResponse>{
    try {
      const validate: User = await this.validate(user);
      const token: string = this.jwtService.sign({sub: validate.id, id: validate.id, email: validate.email, isAdmin: validate.isAdmin, userStatus: validate.userStatus});
      const {dni, orders, password, updateUser, isAdmin, reservations, createUser, ...extra} = validate;
      this.userRepository.save({...validate, userStatus: UserStatus.active});
      return {
        userInfo: extra,
        token
      };
    } catch (error) {
      throw new BadRequestException('Hubo un error al iniciar sesión. Vuelva intentarlo.');
    }
    
  }

  async validate(user: SignInUserDTO): Promise<User>{
    try {
      const exist: User = await this.userService.getUserByEmail(user.email);
      if(!(await bcrypt.compare(user.password, exist.password))) throw new NotFoundException('Mail o contraseña incorrecta.')
        return exist; 
    } catch (error) {
      throw new NotFoundException('Mail o contraseña incorrecta.')
    }
  }

  async tokenRefresh(token: string): Promise<RefreshTokenDTO> {
    try {
      const payload: TokenRefreshPayloadDTO = await this.jwtService.verifyAsync(token, {secret: SECRET_SECRET_WORD});
      const tokenRefresh: string = this.jwtService.sign({sub: payload.sub, email: payload.email, id: payload.id, isAdmin: payload.isAdmin, userStatus: payload.userStatus});
      return { tokenAccess: tokenRefresh };
    } catch (error) {
      throw new InternalServerErrorException('Lo lamentamos hubo un error, vuelva iniciar sesión.')
    }
  }
}
