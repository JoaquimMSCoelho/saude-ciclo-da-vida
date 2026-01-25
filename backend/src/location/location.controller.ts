import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
// Nota: Importaremos o AuthGuard depois se já tiver autenticação configurada. 
// Por enquanto, deixamos aberto ou simulamos o user id.

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  // ROTA 1: O Celular envia o GPS (Ping a cada 30s)
  // URL: POST http://localhost:4000/location
  // Body: { "latitude": -23.5, "longitude": -46.6, "userId": "..." }
  @Post()
  create(@Body() body: CreateLocationDto & { userId: string }) {
    // Na versão final, pegaremos o userId do Token JWT (req.user.id)
    // Por enquanto, aceitamos no body para testar
    const { userId, ...locationData } = body; 
    return this.locationService.create(userId, locationData);
  }

  // ROTA 2: O Guardião pergunta "Onde ele está?"
  // URL: GET http://localhost:4000/location/latest/UUID-DO-USUARIO
  @Get('latest/:userId')
  getLatest(@Param('userId') userId: string) {
    return this.locationService.findLatest(userId);
  }

  // ROTA 3: Histórico de Rota
  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.locationService.getHistory(userId);
  }
}