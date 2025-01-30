import { Module} from '@nestjs/common';
import { SpaceService } from 'src/Space/space.service';
import { SpaceController } from 'src/Space/space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/Entities/Space.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Space])],
  controllers: [SpaceController],
  providers: [SpaceService]
})
export class SpaceModule {}
