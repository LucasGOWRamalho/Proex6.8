import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Profile } from '../profile/profile.entity';

export enum NotificationType {
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  ANIMAL_FOUND = 'animal_found',
  NEW_MESSAGE = 'new_message',
  SYSTEM = 'system',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column('text')
  message!: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.SYSTEM,
  })
  type!: NotificationType;

  @Column({ default: false })
  read!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  data?: any; // Dados adicionais como postId, commentId, etc.

  @ManyToOne(() => Profile, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient!: Profile;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  relatedPostId?: string;

  @Column({ nullable: true })
  relatedUserId?: string;
}