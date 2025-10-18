import { DeleteResult } from 'typeorm'

/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

@ApiTags('actors')
@Controller('actors')
export class ActorsController {
  constructor(private readonly actorsService: ActorsService) {}

  @Post()
  create(@Body() createActorDto: CreateActorDto): Promise<Actor> {
    return this.actorsService.create(createActorDto)
  }

  @Get()
  findAll(): Promise<Actor[]> {
    return this.actorsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Actor | null> {
    return this.actorsService.findOne(+id)
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateActorDto: UpdateActorDto,
  ): Promise<Actor | null> {
    return this.actorsService.update(+id, updateActorDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.actorsService.remove(+id)
  }
}
