import { IsString, IsOptional, IsUrl, IsNumber, IsUUID, Min, Max, Length } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @Length(10, 1000)
  descricao!: string;

  @IsOptional()
  @IsUrl()
  imagemUrl?: string;

  @IsString()
  @Length(3, 200)
  localizacao!: string;

  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude!: number;

  @IsUUID()
  autorId!: string;

  @IsOptional()
  @IsString()
  tipoAnimal?: string; // 'cachorro', 'gato', 'outros'

  @IsOptional()
  @IsString()
  status?: string; // 'perdido', 'encontrado', 'para-adocao'
}