import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { UserModule } from 'src/User/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from 'src/Entities/Activity.entity';
import { User } from 'src/Entities/User.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService],
  imports: [UserModule, TypeOrmModule.forFeature([Activity, User]), CloudinaryModule],
})
export class ActivityModule {}
