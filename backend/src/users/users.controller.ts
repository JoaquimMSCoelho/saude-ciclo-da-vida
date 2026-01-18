import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/medications')
  async getMyMeds(@Param('id') id: string) {
    // PGT-01: O controlador apenas delega a orquestração para o serviço protegido
    return await this.usersService.findUserMedications(id);
  }
}