import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationLog } from './entities/location-log.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(LocationLog)
    private locationRepository: Repository<LocationLog>,
    
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 1. Recebe o Ping do GPS e Salva
  async create(userId: string, createLocationDto: CreateLocationDto) {
    // Busca o usuário apenas pelo ID para vincular (Performance)
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      // Se usuário não existe, ignora silenciosamente ou lança erro (Decisão: Ignorar para não travar app)
      return null;
    }

    const log = this.locationRepository.create({
      ...createLocationDto,
      user: user, // Vincula o log ao usuário
    });

    return await this.locationRepository.save(log);
  }

  // 2. Busca o histórico recente (Para o botão "Onde ele está?")
  async findLatest(userId: string) {
    return await this.locationRepository.findOne({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' }, // Pega o último registro
    });
  }

  // 3. Histórico para desenho de rota (Web Admin)
  async getHistory(userId: string, limit: number = 50) {
    return await this.locationRepository.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}