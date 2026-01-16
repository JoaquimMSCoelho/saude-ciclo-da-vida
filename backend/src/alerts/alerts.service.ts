// ARQUIVO: backend/src/alerts/alerts.service.ts
import { Injectable } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  // REGISTRAR O ALERTA
  async create(data: CreateAlertDto) {
    console.log(`🚨 ALERTA RECEBIDO! User: ${data.userId} | GPS: ${data.latitude}, ${data.longitude}`);
    
    return this.prisma.panicAlert.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        userId: data.userId,
        resolved: false, // Começa como "Não resolvido"
      },
    });
  }

  // LISTAR TODOS (Para o Painel Admin futuro)
  async findAll() {
    return this.prisma.panicAlert.findMany({
      include: { user: true }, // Traz os dados do usuário junto
      orderBy: { createdAt: 'desc' } // Os mais recentes primeiro
    });
  }
}