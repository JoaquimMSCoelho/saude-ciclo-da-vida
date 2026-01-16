// ARQUIVO: src/users/users.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post() // Quando alguém enviar dados para /users
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get() // Quando alguém acessar /users
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id') // Quando alguém acessar /users/123
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}