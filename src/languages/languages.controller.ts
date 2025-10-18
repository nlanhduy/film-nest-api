/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { LanguagesService } from './languages.service';

@ApiTags('languages')
@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new language' })
  @ApiResponse({ status: 201, description: 'Language created successfully' })
  create(@Body() createLanguageDto: CreateLanguageDto) {
    return this.languagesService.create(createLanguageDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all languages' })
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a language by ID' })
  findOne(@Param('id') id: string) {
    return this.languagesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a language by ID' })
  update(
    @Param('id') id: string,
    @Body() updateLanguageDto: UpdateLanguageDto,
  ) {
    return this.languagesService.update(+id, updateLanguageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a language by ID' })
  remove(@Param('id') id: string) {
    return this.languagesService.remove(+id);
  }
}
