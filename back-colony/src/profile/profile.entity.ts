import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ nullable: true })
  cidade!: string;

  @Column({ nullable: true })
  bairro!: string;

  @Column({ nullable: true })
  fotoUrl!: string;
}
