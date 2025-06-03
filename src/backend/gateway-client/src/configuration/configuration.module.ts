import { Module } from "@nestjs/common";
import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";
import { Configuration,ConfigurationSchema } from "./shema/configuration.shema";
import { MongooseModule } from "@nestjs/mongoose";

@Module({
    imports: [
      MongooseModule.forFeature([{ name: Configuration.name, schema:  ConfigurationSchema }]),
    ],
     controllers:[ConfigurationController],
     providers:[ConfigurationService ],
    exports:[MongooseModule]
  })
  
  export class ConfigurationModule{}