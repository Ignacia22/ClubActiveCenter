import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { SpaceService } from 'src/Space/space.service';
import { SpaceController } from 'src/Space/space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from 'src/Entities/Space.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Space]), CloudinaryModule],
  controllers: [SpaceController],
  providers: [SpaceService],
  exports: [SpaceService], // Exportamos el servicio por si es necesario en otros módulos
})
export class SpaceModule implements OnModuleInit {
  private readonly logger = new Logger(SpaceModule.name);
  constructor(private spaceService: SpaceService) {}

  async onModuleInit() {
    try {
      // Intentamos inicializar los espacios, pero no bloqueamos la aplicación si falla
      this.logger.log('Intentando inicializar espacios...');
      await this.spaceService.addSpace();
      this.logger.log('Espacios inicializados correctamente');
    } catch (error) {
      // En lugar de lanzar un error, solo registramos la advertencia
      this.logger.warn(`No se pudieron inicializar los espacios automáticamente: ${error.message}`);
      // Continuamos con la inicialización de la aplicación sin bloquear
    }
  }
}