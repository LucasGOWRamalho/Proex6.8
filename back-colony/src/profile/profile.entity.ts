import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  nome!: string;

  @Column({ unique: true }) // ✅ ADICIONAR
  email!: string;

  @Column() // ✅ ADICIONAR
  password!: string;

  @Column({ nullable: true })
  cidade!: string;

  @Column({ nullable: true })
  bairro!: string;

  @Column({ nullable: true })
  fotoUrl!: string;

  @CreateDateColumn() // ✅ ADICIONAR
  createdAt!: Date;
}