import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';
import { CreateSubscriptionDTO } from './SubscriptionDTO/subscription.dto';
import { SubscribeResponseDTO, SubscriptionResponseDTO } from './SubscriptionDTO/Subscription.enum';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionDetail)
    private subscriptionDetailRepository: Repository<SubscriptionDetail>,
  ) {}

  async getSubscriptions(): Promise<SubscriptionResponseDTO[]> {
    try {
      return await this.subscriptionRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al obtener todas las subcripciones.',
        error.message || error,
      );
    }
  }

  async getSubscriptionById(id: string): Promise<SubscriptionResponseDTO> {
    try {
      const sub: Subscription | null =
        await this.subscriptionRepository.findOneBy({ id });
      if (!sub) throw new NotFoundException('No se encontro la suscripción.');
      return sub;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al obtener la subcripción.',
        error.message || error,
      );
    }
  }

  async subscribe(userId: string, subId: string): Promise<SubscribeResponseDTO> {
    try {
      const User: User | null = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!User) throw new NotFoundException('No existe el usuario.');
      const exist: SubscriptionDetail | null = await this.subscriptionDetailRepository.findOne({where: {user: {id: userId}}, relations: ['user']});
      if(exist?.status !== false && exist) throw new BadRequestException('Ya te encuentras suscrito.');
      const subscription: Subscription | null = await this.subscriptionRepository.findOneBy({ id: subId });
      if (!subscription)
        throw new NotFoundException('No existe la suscripción');
      let detail: SubscriptionDetail = await this.subscriptionDetail(User, subscription);
      const { user, ...extras} = detail;
      const { id, isSubscribed, ...extra } = User;
      return {...extras, user: {id, isSubscribed: true}};
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if(error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al suscribirse a la subcripción.',
        error.message || error,
      );
    }
  }

  async subscriptionDetail(
    user: User,
    subscription: Subscription,
  ): Promise<SubscriptionDetail> {
    try {
      const newSubscriptionDetail: SubscriptionDetail = {
        dayInit: new Date(),
        dayEnd: new Date(
          new Date().setDate(new Date().getDate() + subscription.duration),
        ),
        price: subscription.price,
        user: {...user, isSubscribed: true},
        subscription: subscription,
      };
      const detail: SubscriptionDetail = await this.subscriptionDetailRepository.save(
        newSubscriptionDetail,
      );
      await this.userRepository.save({...user, isSubscribed: true});
      return detail;

    } catch (error) {
      throw new InternalServerErrorException(
        'Error al crear los detalles de la suscripción.',
        error.message || error,
      );
    }
  }

  async unsubscribe(id: string): Promise<string> {
    try {
      const subDetail: SubscriptionDetail | null =
        await this.subscriptionDetailRepository.findOne({ where: { id }, relations: ['user'] });
      if (!subDetail)
        throw new NotFoundException(
          'No se encontro los detalles de la suscripción.',
        );
      if(subDetail.status !== true) throw new BadRequestException('Ya esta cancelada la suscripción.');
      await this.subscriptionDetailRepository.save({
        ...subDetail,
        status: false,
      });
      if(!subDetail.user) throw new NotFoundException('No se encontro al usuario asociado.');
      await this.userRepository.update(subDetail.user.id, { isSubscribed: false });
      return 'Se cancelo la suscripción.';
    } catch (error) {
      if(error instanceof BadRequestException) throw error;
      if(error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un error al cancelar la subcripción.',
        error.message || error,
      );
    }
  }

  async deleteSubscription(id: string): Promise<string> {
    try {
      const sub: Subscription | null =
        await this.subscriptionRepository.findOneBy({ id });
      if (!sub)
        throw new NotFoundException(
          'No se encontro los detalles de la suscripción.',
        );
      await this.subscriptionDetailRepository.delete(sub);
      return `Se borro la plantilla de la suscripción ${sub.name}.`;
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al borrar la subcripción.',
        error.message || error,
      );
    }
  }

  async createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionResponseDTO> {
    try {
      return await this.subscriptionRepository.save(data);
    } catch (error) {
      throw error.detail
        ? new ConflictException(error.detail)
        : new InternalServerErrorException(
            'Hubo un error al crear la suscripción.',
            error.message || 'Error desconocido.',
          );
    }
  }
}
