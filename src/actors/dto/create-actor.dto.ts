import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

import { ApiProperty } from '@nestjs/swagger'

export class CreateActorDto {
  @ApiProperty({ example: 'Tom', description: 'First name of the actor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  first_name: string

  @ApiProperty({ example: 'Cruise', description: 'Last name of the actor' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(45)
  last_name: string
}
