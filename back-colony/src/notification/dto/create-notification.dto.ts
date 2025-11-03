import { IsString, IsUUID, IsEnum, IsOptional, IsObject } from 'class-validator';
import { NotificationType } from '../notification.entity';

export class CreateNotificationDto {
  @IsUUID()
  recipientId!: string;

  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsOptional()
  @IsObject()
  data?: any;

  @IsOptional()
  @IsUUID()
  relatedPostId?: string;

  @IsOptional()
  @IsUUID()
  relatedUserId?: string;
}