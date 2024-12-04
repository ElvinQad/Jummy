import {
  IsString,
  IsEmail,
  IsNotEmpty,
  ValidateNested,
  IsBoolean,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from '../../users/dto/create-user.dto';

class RegisterProfile {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsString()
  avatar?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address!: AddressDto;
}

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  phone!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @ValidateNested()
  @Type(() => RegisterProfile)
  profile?: RegisterProfile;

  @IsBoolean()
  @IsOptional()
  isChef?: boolean;
}
