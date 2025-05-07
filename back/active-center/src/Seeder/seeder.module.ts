import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { SeeederDB } from './seeder.service';
import { UserModule } from 'src/User/user.module';

@Module({
  providers: [SeeederDB],
  imports: [UserModule],
})
export class SeederModule implements OnApplicationBootstrap {
  constructor(private readonly seeder: SeeederDB) {}
  async onApplicationBootstrap(): Promise<void> {
    await this.seeder.seederDB();
    console.log('Seeder deshabilitado temporalmente');
  }
}
