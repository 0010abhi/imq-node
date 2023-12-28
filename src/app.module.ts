import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoogleMapService } from './google-map/google-map.service';

@Module({
  // imports: [],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module global
    }),
  ],
  controllers: [AppController],
  providers: [AppService, GoogleMapService],
})
export class AppModule {}
