import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CreateActorDto } from './dto/create-actor.dto'
import { UpdateActorDto } from './dto/update-actor.dto'
import { Actor } from './entities/actor.entity'

@Injectable()
export class ActorsService {
  constructor(
    @InjectRepository(Actor)
    private actorsRepository: Repository<Actor>,
  ) {}

  create(createActorDto: CreateActorDto) {
    const actor = this.actorsRepository.create(createActorDto)
    return this.actorsRepository.save(actor)
  }

  findAll() {
    return this.actorsRepository.find()
  }

  findOne(id: number) {
    return this.actorsRepository.findOneBy({ actor_id: id })
  }

  async update(id: number, updateActorDto: UpdateActorDto) {
    await this.actorsRepository.update(id, updateActorDto)
    return this.findOne(id)
  }

  remove(id: number) {
    return this.actorsRepository.delete(id)
  }
}
