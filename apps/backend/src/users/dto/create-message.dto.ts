import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  senderId!: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  receiverId!: number;


  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  conversationId!: number;
  
  
}
