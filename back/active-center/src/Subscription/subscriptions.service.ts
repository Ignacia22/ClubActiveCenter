import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
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
import {  SubscriptionResponseDTO } from './SubscriptionDTO/Subscription.enum';
import { PaymentService } from 'src/Payment/payment.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionDetail)
    private subscriptionDetailRepository: Repository<SubscriptionDetail>,
    @Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
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

  async subscribe(userId: string, subId: string): Promise<{ url: string }> {
    try {

        const user: User | null = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            console.error(`Usuario no encontrado: ${userId}`);
            throw new NotFoundException('No existe el usuario.');
        }
        const existingSubscription: SubscriptionDetail | null = await this.subscriptionDetailRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (existingSubscription) {
            if (existingSubscription.status !== false) {
                throw new BadRequestException('Ya te encuentras suscrito.');
            }
        } else {
        }
        const subscription: Subscription | null = await this.subscriptionRepository.findOneBy({ id: subId });

        if (!subscription) {
            throw new NotFoundException('No existe la suscripción.');
        }
        const { url } = await this.paymentService.createCheckoutSessionSub(userId, subId);
        return { url: url ?? '' };

    } catch (error) {
        if (error instanceof NotFoundException || error instanceof BadRequestException) {
            throw error;
        }
        throw new InternalServerErrorException('Hubo un error al suscribirse.', error.message || error);
    }
  }

  async subscriptionDetail(
    user: User,
    subscription: Subscription,
  ): Promise<SubscriptionDetail> {
    try {
        if (!subscription.duration) {
            throw new InternalServerErrorException('La suscripción no tiene una duración válida.');
        }
        if (!subscription.price) {
            throw new InternalServerErrorException('La suscripción no tiene un precio válido.');
        }

        const newSubscriptionDetail = this.subscriptionDetailRepository.create({
            dayInit: new Date(),
            dayEnd: new Date(new Date().setDate(new Date().getDate() + subscription.duration)),
            price: subscription.price,
            user: {...user, isSubscribed: true},
            subscription: subscription,
        });

        const detail = await this.subscriptionDetailRepository.save(newSubscriptionDetail);

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

  async activateSubscription(userId: string, subId: string) { 
    try {

        const subscription = await this.subscriptionRepository.findOne({ where: { id: subId } });
        const user = await this.userRepository.findOne({ where: { id: userId } });

        if (!user || !subscription) {
            throw new NotFoundException('Usuario o suscripción no encontrados');
        }
        const durationDays = subscription.duration ?? 31; 
        const newSubscription = this.subscriptionDetailRepository.create({
            user,
            subscription,
            duration: durationDays,
            dayInit: new Date(),
            dayEnd: new Date(new Date().setDate(new Date().getDate() + durationDays)),
            price: subscription.price,
            status: true, 
        });

        await this.subscriptionDetailRepository.save(newSubscription);
        user.isSubscribed = true;
        await this.userRepository.save(user);

    } catch (error) {
        throw new InternalServerErrorException('Hubo un error al activar la suscripción.', error?.message || error);
    }
  }

}
