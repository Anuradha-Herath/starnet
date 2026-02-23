import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbService } from './mongodb.service';
import { AuthModule } from './auth/auth.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/starnet'),
    AuthModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    MongodbService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
