import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from 'src/Entities/Activity.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import {
  ActivitiesPageDTO,
  ActivityResponseDTO,
  CreateActivityDTO,
  StatusActivity,
} from './activitiesDTO/Activity.dto';
import { User } from 'src/Entities/User.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    private dataSource: DataSource,
    private cloudinary: CloudinaryService,
  ) {}

  async getActivities(page: number, limit: number): Promise<ActivitiesPageDTO> {
    try {
      const activities: Activity[] = await this.activityRepository.find();
      if (!activities.length)
        throw new NotFoundException(
          'Lo lamentamos aun no hay ningúna actividad, intentelo más tarde.',
        );
      const totalItems: number = activities.length;
      const maxPages: number = Math.ceil(totalItems / limit);
      const currentPage: number = Math.min(Math.max(1, page), maxPages);
      const init: number = (currentPage - 1) * limit;
      const end: number = Math.min(currentPage * limit, totalItems);
      const getActivities = activities.slice(init, end);
      const Page: ActivitiesPageDTO = {
        infoPage: {
          totalItems,
          maxPages,
          page: currentPage,
          currentUsers: getActivities.length,
        },
        activities: getActivities,
      };
      return Page;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Lo lamnetamos hubo algun error al buscar las actividades.',
        error.message || error,
      );
    }
  }

  async getActivityById(id: string): Promise<ActivityResponseDTO> {
    try {
      const activity: Activity | null = await this.activityRepository.findOneBy(
        { id },
      );
      if (!activity) throw new NotFoundException('No existe la actividad.');
      return activity;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un problema al obtener la actividad.',
        error.message || error,
      );
    }
  }

  async createActivity(
    activity: CreateActivityDTO,
    file: Express.Multer.File,
  ): Promise<ActivityResponseDTO> {
    try {
      const exist: null | Activity = await this.activityRepository.findOneBy({
        title: activity.title,
      });
      const img: string | null = await this.cloudinary.uploadImage(file);
      if (exist)
        throw new ConflictException(
          'Ya existe una actividad con el mismo nombre, cambia el titulo por favor.',
        );
      return await this.activityRepository.save({ ...activity, img });
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      else
        throw new InternalServerErrorException(
          'Hubo algun error al crear la actividad.',
          error.message || error,
        );
    }
  }

  async registerActivity(email: string, activityId: string): Promise<string> {
    try {
      return await this.dataSource.transaction(
        async (entityManager: EntityManager): Promise<string> => {
          const activity = await entityManager.findOne(Activity, {
            where: { id: activityId },
            relations: ['users'],
          });
          if (!activity) throw new NotFoundException('No existe la actividad.');
          if (activity.status === StatusActivity.CANCEL)
            throw new BadRequestException('Lo lamentamos, esta actividad fue cancelada.');
          const user = await entityManager.findOneBy(User, { email });
          if (!user) throw new NotFoundException('No existe el usuario.');
          const messageCancel = await this.cancelRegister(entityManager, user, activity);
          if (messageCancel) return messageCancel;
  
          // Verificar cupo antes de actualizar
          if (activity.registeredPeople + 1 > activity.maxPeople)
            throw new BadRequestException('Lo lamentamos, el cupo ya está lleno.');
          activity.users.push(user);
          activity.registeredPeople += 1;
          activity.status = activity.registeredPeople < activity.maxPeople ? StatusActivity.ACTIVE : StatusActivity.Full;
          await entityManager.save(Activity, activity);
          return `Te has registrado con éxito a ${activity.title}.`;
        },
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Lo lamentamos hubo un error al registraese.',
        error.message || error,
      );
    }
  }

  async cancelRegister(
    entityManger: EntityManager,
    user: User,
    activity: Activity,
  ): Promise<null | string> {
    try {
      const exist: User | undefined = activity.users.find(
        (userActivity) => userActivity.id === user.id,
      );
      if (!exist) return null;
      const updatedUsers: User[] = activity.users.filter(
        (userActivity) => userActivity.id !== user.id,
      );
      const updatedRegisteredPeople: number = activity.registeredPeople - 1;
      const updateActivity: Activity = {
        ...activity,
        users: updatedUsers,
        registeredPeople: updatedRegisteredPeople,
        status: updatedRegisteredPeople < activity.maxPeople ? StatusActivity.ACTIVE : StatusActivity.Full,
      };
      await entityManger.save(Activity, updateActivity);
      return `Has cancelo el registro a ${activity.title}.`;
    } catch (error) {
      throw new InternalServerErrorException(error.message || error);
    }
  }

  async cancelActivity(id: string): Promise<string> {
    try {
      const exist: Activity | null = await this.activityRepository.findOneBy({
        id,
      });
      if (!exist) throw new NotFoundException('No existe la actividad.');
      await this.activityRepository.save({ ...exist, status: StatusActivity.CANCEL });
      return 'Se cancelo la actividad.';
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'Hubo un problema al queres cancelar la actividad. Error:',
        error.messaje || error,
      );
    }
  }
}
