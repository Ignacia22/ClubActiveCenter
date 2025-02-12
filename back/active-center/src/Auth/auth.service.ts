/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SALT, SECRET_SECRET_WORD } from 'src/config/config.envs';
import { User } from 'src/Entities/User.entity';
import { UserService } from 'src/User/user.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  RegisterUserDTO,
  SignInUserDTO,
  UserDTOResponse,
  UserStatus,
} from 'src/User/UserDTO/users.dto';
import {
  BanDTOResponse,
  LoginDTO,
  RefreshTokenDTO,
  SingInDTOResponse,
  TokenRefreshPayloadDTO,
} from './AuthDTO/auths.dto';
import { SendGridService } from 'src/SendGrid/sendGrid.service';
import { userMAin } from 'src/UserMain';
import { Chat } from 'src/Entities/Chat.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Chat) private chatRepository:Repository<Chat>,
    private readonly jwtService: JwtService,
    private readonly sendGridService: SendGridService,
  ) {}

  async SignUp(
    user: Omit<RegisterUserDTO, 'passwordConfirmation'>,
  ): Promise<SingInDTOResponse> {
    try { 
      user.password = await this.userService.hashPassword(user.password);
      const exist: User | null = await this.userDeleted(user);
      if (exist) return await this.saveUser({ ...exist, ...user });
      const registerUser: User = await this.userRepository.save({...user, userStatus: UserStatus.active});
      const {
        updateUser,
        createUser,
        orders,
        reservations,
        password,
        activities,
        cart,
        subscriptionsDetails,
        payments,
        ...partialUser
      } = registerUser;
      const token: string = this.jwtService.sign({
        sub: registerUser.id,
        id: registerUser.id,
        email: registerUser.email,
        isAdmin: registerUser.isAdmin,
        userStatus: registerUser.userStatus,
        isSubscribed: registerUser.isSubscribed
      });
      const chat: Chat = this.chatRepository.create({user});
      await this.chatRepository.save(chat);
      const { email }: { email: string } = user;
      await this.sendGridService.wellcomeMail(email);
      return {
        userInfo: { ...partialUser, userStatus: UserStatus.active },
        token,
      };
    } catch (error) {
      if (error.detail)
        throw new ConflictException(
          `Hubo un error al registrar al usuario: ${error.detail}`,
        );
      throw new InternalServerErrorException(error.message);
    }
  }

  async saveUser(user: User): Promise<SingInDTOResponse> {
    const registerUser: User = await this.userRepository.save({
      ...user,
      userStatus: UserStatus.active,
    });
    const {
      updateUser,
      createUser,
      orders,
      reservations,
      password,
      activities,
      cart,
      subscriptionsDetails,
      payments,
      ...partialUser
    } = registerUser;
    const token: string = this.jwtService.sign({
      sub: registerUser.id,
      id: registerUser.id,
      email: registerUser.email,
      isAdmin: registerUser.isAdmin,
      userStatus: registerUser.userStatus,
      isSubscribed: registerUser.isSubscribed
    });
    const { email }: { email: string } = user;
    await this.sendGridService.wellcomeMail(email);
    return {
      userInfo: { ...partialUser, userStatus: UserStatus.active },
      token,
    };
  }

  async userDeleted(
    user: Omit<RegisterUserDTO, 'passwordConfirmation'>,
  ): Promise<User | null> {
    try {
      const userDeleted: User | null = await this.userService.getUserByEmail(
        user.email,
      );
      if (!userDeleted || userDeleted.userStatus !== UserStatus.delete)
        return null;
      return userDeleted;
    } catch (error) {
      throw new InternalServerErrorException('Error desconocido.');
    }
  }

  async SignIn(user: SignInUserDTO): Promise<SingInDTOResponse> {
    try {
      const validate: User = await this.validate(user);
      const token: string = this.jwtService.sign({
        sub: validate.id,
        id: validate.id,
        email: validate.email,
        isAdmin: validate.isAdmin,
        userStatus: validate.userStatus,
        isSubscribed: validate.isSubscribed
      });
      this.userRepository.save({ ...validate, userStatus: UserStatus.active });
      const {
        dni,
        cart,
        chat,
        orders,
        payments,
        password,
        updateUser,
        createUser,
        activities,
        reservations,
        subscriptionsDetails,
        ...extra
      } = validate;
      return {
        userInfo: { ...extra, userStatus: UserStatus.active },
        token,
      };
    } catch (error) {
      throw new BadRequestException(
        `Hubo un error al iniciar sesión. Vuelva intentarlo. ${error.message}`,
      );
    }
  }

  async validate(user: SignInUserDTO): Promise<User> {
    try {
      const exist: User | null = await this.userService.getUserByEmail(
        user.email,
      );
      if (
        !exist ||
        !(
          (await bcrypt.compare(user.password, exist.password)) ||
          exist.userStatus === UserStatus.delete
        )
      )
        throw new BadRequestException('Mail o contraseña incorrecta.');
      if (exist && exist.userStatus === UserStatus.delete)
        throw new BadRequestException('Mail o contraseña incorrecta.');
      if (exist && exist.userStatus === UserStatus.ban)
        throw new UnauthorizedException('Usuario baneado.');
      return exist;
    } catch (error) {
      throw error;
    }
  }

  async tokenRefresh(token: string): Promise<RefreshTokenDTO> {
    try {
      const payload: TokenRefreshPayloadDTO = await this.jwtService.verifyAsync(
        token,
        { secret: SECRET_SECRET_WORD },
      );
      const user: User | null = await this.userRepository.findOneBy({id: payload.id});
      const tokenRefresh: string = this.jwtService.sign({
        sub: user?.id,
        email: user?.email,
        id: user?.id,
        isAdmin: user?.isAdmin,
        userStatus: user?.userStatus,
        isSubscribed: user?.isSubscribed
      });
      return { tokenAccess: tokenRefresh };
    } catch (error) {
      throw new InternalServerErrorException(
        'Lo lamentamos hubo un error, vuelva iniciar sesión.',
      );
    }
  }

  async isBan(id: string): Promise<BanDTOResponse> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id });
      const admin: User | null = await this.userService.getUserByEmail(
        userMAin.email,
      );
      if (!user) throw new NotFoundException('No existe el usuario.');
      if (id === admin?.id)
        throw new BadRequestException(
          'Esta prohibido modificar de alguna forma este usuario.',
        );
      if (user.userStatus === UserStatus.delete) {
        throw new ConflictException(
          'No se puede banear a un usuario que fue eliminado.',
        );
      }
      if (user.userStatus === UserStatus.ban) {
        await this.userRepository.save({
          ...user,
          userStatus: UserStatus.disconect,
        });
        return {
          user: {
            id,
          },
          message: 'El Usuario fue desbaneado.',
        };
      }
      await this.userRepository.save({ ...user, userStatus: UserStatus.ban });
      return {
        user: {
          id,
        },
        message: 'El Usuario fue baneado.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error en la petición.',
        error.message || error,
      );
    }
  }

  async LogOut(id: string): Promise<'Te has desconectado.'> {
    try {
      const user: User | null = await this.userRepository.findOneBy({ id });
      if (!user) throw new NotFoundException('El usuario no existe');
      if (user.userStatus === UserStatus.disconect) {
        throw new BadRequestException(
          'Este usuario ya se encuentra desconectado.',
        );
      }
      await this.userRepository.save({
        ...user,
        userStatus: UserStatus.disconect,
      });
      return 'Te has desconectado.';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al cerrar sesión',
        error.message || error,
      );
    }
  }

  async isAdmin(id: string): Promise<BanDTOResponse> {
    try {
      const user: null | User = await this.userRepository.findOneBy({ id });
      const admin: User | null = await this.userService.getUserByEmail(
        userMAin.email,
      );
      if (id === admin?.id)
        throw new BadRequestException(
          'Esta prohibido modificar de alguna forma este usuario.',
        );
      if (!user) throw new NotFoundException('El usuario no existe.');
      !user.isAdmin
        ? await this.userRepository.save({ ...user, isAdmin: true })
        : await this.userRepository.save({ ...user, isAdmin: false });
      return !user.isAdmin
        ? {
            user: { id },
            message: `El usuario "${user.name}" ahora es administrador.`,
          }
        : {
            user: { id },
            message: `El usuario "${user.name}" ya no es administrador.`,
          };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error en la petición.',
        error.message || error,
      );
    }
  }

  async login({ email }: LoginDTO): Promise<SingInDTOResponse> {
    try {
      const user: User | null = await this.userService.getUserByEmail(email);
      if (!user || user.userStatus === UserStatus.delete)
        throw new NotFoundException('No existe el usuario.');
      const token: string = this.jwtService.sign({
        sub: user.id,
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        userStatus: user.userStatus,
        isSubscribed: user.isSubscribed
      });
      this.userRepository.save({ ...user, userStatus: UserStatus.active });
      const {
        dni,
        cart,
        chat,
        orders,
        payments,
        password,
        updateUser,
        createUser,
        activities,
        reservations,
        subscriptionsDetails,
        ...extra
      } = user;
      return {
        userInfo: { ...extra, userStatus: UserStatus.active },
        token,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al iniciar sesión',
        error.message || error,
      );
    }
  }
}
