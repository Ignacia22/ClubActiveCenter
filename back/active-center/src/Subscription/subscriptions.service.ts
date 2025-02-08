import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from 'src/Entities/Subscription.entity';
import { SubscriptionDetail } from 'src/Entities/SubscriptionDetails.entity';
import { User } from 'src/Entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionDetail)
    private subscriptionDetailRepository: Repository<SubscriptionDetail>,
  ) {}

  async getSubscriptions(): Promise<Subscription[]> {
    try {
      return await this.subscriptionRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al obtener todas las subcripciones.',
        error.message || error,
      );
    }
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
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

  async subscribe(userId: string, subId: string): Promise<SubscriptionDetail> {
    try {
      const user: User | null = await this.userRepository.findOneBy({
        id: userId,
      });
      if (!user) throw new NotFoundException('No existe el usuario.');
      const subscription: Subscription | null =
        await this.subscriptionRepository.findOneBy({ id: subId });
      if (!subscription)
        throw new NotFoundException('No existe la suscripción');
      return await this.subscriptionDetail(user, subscription);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
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
        user: user,
        subscription: subscription,
      };
      return await this.subscriptionDetailRepository.save(
        newSubscriptionDetail,
      );
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
        await this.subscriptionDetailRepository.findOneBy({ id });
      if (!subDetail)
        throw new NotFoundException(
          'No se encontro los detalles de la suscripción.',
        );
      await this.subscriptionDetailRepository.save({
        ...subDetail,
        status: false,
      });
      return 'Se cancelo la suscripción.';
    } catch (error) {
      throw new InternalServerErrorException(
        'Hubo un error al cancelar la subcripción.',
        error.message || error,
      );
    }
  }

  async deleteSubscription(id: string) {
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
}
