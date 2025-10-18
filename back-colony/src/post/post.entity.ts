import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Profile } from '../profile/profile.entity';

export class Post {
  id!: number;
  descricao!: string;
  imagemUrl!: string;
  localizacao!: string;
  autor!: string;
  criadoEm!: Date;
}

