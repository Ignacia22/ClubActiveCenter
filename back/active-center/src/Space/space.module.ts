import { Module, OnModuleInit } from '@nestjs/common';
import { SpaceService } from 'src/Space/space.service';
import { SpaceController } from 'src/Space/space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/Entities/Space.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Space]), CloudinaryModule],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule implements OnModuleInit {
  constructor(private spaceService: SpaceService) {}

  async onModuleInit() {
    try {
      await this.spaceService.addSpace();
    } catch {
      throw new Error('Method not implemented.');
    }
  }
}
