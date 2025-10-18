/* eslint-disable prettier/prettier */
import { IsArray, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateFilmDto {
  @ApiProperty({ example: 'Inception', description: 'Title of the film' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'A mind-bending thriller about dreams.',
    description: 'Film description',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 2010,
    description: 'Year of release (e.g. 2010)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1888) // First movie recorded year
  release_year?: number;

  @ApiProperty({ example: 1, description: 'Language ID of the film' })
  @IsInt()
  language_id: number;

  @ApiProperty({
    example: 2,
    description: 'Original language ID (optional)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  original_language_id?: number;

  @ApiProperty({
    example: 3,
    description: 'Rental duration (in days)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  rental_duration?: number;

  @ApiProperty({
    example: 4.99,
    description: 'Rental rate (USD)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  rental_rate?: number;

  @ApiProperty({
    example: 120,
    description: 'Film length in minutes',
    required: false,
  })
  @IsOptional()
  @IsInt()
  length?: number;

  @ApiProperty({
    example: 19.99,
    description: 'Replacement cost in USD',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  replacement_cost?: number;

  @ApiProperty({
    example: 'PG-13',
    description: 'Film rating (e.g. G, PG, PG-13, R, NC-17)',
    required: false,
  })
  @IsOptional()
  @IsString()
  rating?: string;

  @ApiProperty({
    example: ['Trailers', 'Deleted Scenes'],
    description: 'Special features available',
    required: false,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  special_features?: string[];
}
