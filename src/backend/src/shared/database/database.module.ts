import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './admin.seeder';
import { UserModule } from 'src/user/user.module';


@Global()
@Module({
  imports: [
    UserModule
  ],
  providers: [SeedService],
 
})
export class DatabaseModule {}
