import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(2)
  password: string;
  
  @ApiProperty({ required: false, nullable: true })
  @IsString()
  @ValidateIf((object) => object.refreshToken !== null)
  refreshToken: string | null;
}
