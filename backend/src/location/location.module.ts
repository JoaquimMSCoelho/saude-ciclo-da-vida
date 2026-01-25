import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { LocationLog } from './entities/location-log.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationLog, User])],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService] // Exporta caso o módulo de Alerta precise usar
})
export class LocationModule {}