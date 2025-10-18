import { Repository } from 'typeorm'

import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CreateLanguageDto } from './dto/create-language.dto'
import { UpdateLanguageDto } from './dto/update-language.dto'
import { Language } from './entities/language.entity'

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  create(createLanguageDto: CreateLanguageDto): Promise<Language> {
    const language = this.languageRepository.create(createLanguageDto)
    return this.languageRepository.save(language)
  }

  findAll(): Promise<Language[]> {
    return this.languageRepository.find()
  }

  async findOne(id: number): Promise<Language> {
    const language = await this.languageRepository.findOneBy({
      language_id: id,
    })
    if (!language) throw new NotFoundException(`Language with ID ${id} not found`)
    return language
  }

  async update(id: number, updateLanguageDto: UpdateLanguageDto): Promise<Language> {
    const language: Language = await this.findOne(id)
    Object.assign(language, updateLanguageDto)
    return this.languageRepository.save(language)
  }

  async remove(id: number): Promise<void> {
    const result = await this.languageRepository.delete(id)
    if (result.affected === 0) throw new NotFoundException(`Language with ID ${id} not found`)
  }
}
