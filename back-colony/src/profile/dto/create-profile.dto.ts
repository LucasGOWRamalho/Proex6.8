import { IsOptional, IsString, Length } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(3, 50)
  nome!: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  bairro?: string;
}
