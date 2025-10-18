import { Repository } from 'typeorm'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CreateFilmDto } from './dto/create-film.dto'
import { UpdateFilmDto } from './dto/update-film.dto'
import { Film } from './entities/film.entity'

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>
  ) {}

  create(createFilmDto: CreateFilmDto): Promise<Film> {
    const film = this.filmRepository.create(createFilmDto)
    return this.filmRepository.save(film)
  }

  findAll(): Promise<Film[]> {
    return this.filmRepository.find({
      relations: ['language', 'original_language'],
    })
  }

  async findOne(id: number): Promise<Film> {
    const film = await this.filmRepository.findOne({
      where: { film_id: id },
      relations: ['language', 'original_language'],
    })
    if (!film) throw new NotFoundException(`Film with ID ${id} not found`)
    return film
  }

  async update(id: number, updateFilmDto: UpdateFilmDto): Promise<Film> {
    const film = await this.findOne(id)
    Object.assign(film, updateFilmDto)
    return this.filmRepository.save(film)
  }

  async remove(id: number): Promise<void> {
    const result = await this.filmRepository.delete(id)
    if (result.affected === 0) throw new NotFoundException(`Film with ID ${id} not found`)
  }
}
