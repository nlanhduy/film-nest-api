/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateFilmDto } from './dto/create-film.dto';
import { UpdateFilmDto } from './dto/update-film.dto';
import { FilmsService } from './films.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/guards/roles.decorator';
import { Role } from 'src/common/enum';

@UseGuards(RolesGuard)
@ApiTags('films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Roles(Role.Admin, Role.SuperAdmin)
  @Post()
  @ApiOperation({ summary: 'Create a new film' })
  @ApiResponse({ status: 201, description: 'Film created successfully' })
  create(@Body() createFilmDto: CreateFilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all films' })
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a film by ID' })
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a film by ID' })
  update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
    return this.filmsService.update(+id, updateFilmDto);
  }

  @Roles(Role.SuperAdmin)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a film by ID' })
  remove(@Param('id') id: string) {
    return this.filmsService.remove(+id);
  }
}
