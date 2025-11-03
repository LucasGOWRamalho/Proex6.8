import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Profile } from '../profile/profile.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<Notification> {
    const recipient = await this.profileRepo.findOne({
      where: { id: createNotificationDto.recipientId },
    });

    if (!recipient) {
      throw new NotFoundException('Destinatário não encontrado');
    }

    const notification = this.notificationRepo.create({
      ...createNotificationDto,
      recipient,
    });

    return await this.notificationRepo.save(notification);
  }

  async findByUser(userId: string, unreadOnly: boolean = false): Promise<Notification[]> {
    const where: any = { recipient: { id: userId } };
    
    if (unreadOnly) {
      where.read = false;
    }

    return await this.notificationRepo.find({
      where,
      relations: ['recipient'],
      order: { createdAt: 'DESC' },
      take: 50, // Limite para performance
    });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await this.notificationRepo.count({
      where: {
        recipient: { id: userId },
        read: false,
      },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepo.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    notification.read = true;
    return await this.notificationRepo.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepo
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('recipient_id = :userId', { userId })
      .andWhere('read = :read', { read: false })
      .execute();
  }

  async remove(id: string): Promise<void> {
    const notification = await this.notificationRepo.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Notificação não encontrada');
    }

    await this.notificationRepo.remove(notification);
  }

  // Métodos específicos para tipos de notificação
  async createPostLikeNotification(
    recipientId: string,
    postId: string,
    likedByUserId: string,
    likedByName: string,
  ): Promise<Notification> {
    return this.create({
      recipientId,
      title: 'Nova curtida',
      message: `${likedByName} curtiu seu post`,
      type: NotificationType.POST_LIKE,
      data: { postId, likedByUserId },
      relatedPostId: postId,
      relatedUserId: likedByUserId,
    });
  }

  async createAnimalFoundNotification(
    recipientId: string,
    postId: string,
    foundByName: string,
    location: string,
  ): Promise<Notification> {
    return this.create({
      recipientId,
      title: 'Animal encontrado!',
      message: `${foundByName} encontrou um animal perto de ${location}`,
      type: NotificationType.ANIMAL_FOUND,
      data: { postId, location },
      relatedPostId: postId,
    });
  }
}