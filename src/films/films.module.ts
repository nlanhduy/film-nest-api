import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Language } from '../languages/entities/language.entity'
import { Film } from './entities/film.entity'
import { FilmsController } from './films.controller'
import { FilmsService } from './films.service'

@Module({
  imports: [TypeOrmModule.forFeature([Film, Language])],
  controllers: [FilmsController],
  providers: [FilmsService],
  exports: [FilmsService],
})
export class FilmsModule {}
