import { IsOptional, IsString, Length, IsEmail, MinLength } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  @Length(3, 50)
  nome!: string;

  @IsEmail() // ✅ ADICIONAR
  email!: string;

  @IsString() // ✅ ADICIONAR
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  cidade?: string;

  @IsOptional()
  @IsString()
  bairro?: string;
}