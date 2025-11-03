import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Profile } from '../profile/profile.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  descricao!: string;

  @Column({ nullable: true })
  imagemUrl!: string;

  @Column()
  localizacao!: string;

  @Column('decimal', { precision: 10, scale: 6 })
  latitude!: number;

  @Column('decimal', { precision: 10, scale: 6 })
  longitude!: number;

  @ManyToOne(() => Profile, (profile) => profile.id, { eager: true })
  @JoinColumn({ name: 'autor_id' })
  autor!: Profile;

  @CreateDateColumn()
  criadoEm!: Date;

  @Column({ default: 'outros' })
  tipoAnimal!: string; // 'cachorro', 'gato', 'outros'

  @Column({ default: 'perdido' })
  status!: string; // 'perdido', 'encontrado', 'para-adocao'
}