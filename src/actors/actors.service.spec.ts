/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor } from './entities/actor.entity';

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private readonly actorRepository: Repository<Actor>,
  ) {}

  async create(createActorDto: CreateActorDto): Promise<Actor> {
    const actor = this.actorRepository.create(createActorDto)
    return await this.actorRepository.save(actor);
  }

  async findAll(): Promise<Actor[]> {
    return await this.actorRepository.find()
  }

  async findOne(id: number): Promise<Actor> {
    const actor = await this.actorRepository.findOneBy({ actor_id: id })
    if (!actor) throw new NotFoundException(`Actor with ID ${id} not found`)
    return actor;
  }

  async update(id: number, updateActorDto: UpdateActorDto): Promise<Actor> {
    const actor = await this.findOne(id)
    Object.assign(actor, updateActorDto)
    return await this.actorRepository.save(actor)
  }

  async remove(id: number): Promise<void> {
    const result = await this.actorRepository.delete(id)
    if (result.affected === 0)
      throw new NotFoundException(`Actor with ID ${id} not found`)
  }
}
