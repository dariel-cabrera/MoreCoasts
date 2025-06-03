import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './admin.seeder';
import { UserModule } from 'src/user/user.module';
import { ConfigurationModule } from 'src/configuration/configuration.module';


@Global()
@Module({
  imports: [
    UserModule,
    ConfigurationModule
  ],
  providers: [SeedService],
 
})
export class DatabaseModule {}
