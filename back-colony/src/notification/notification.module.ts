import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './notification.entity';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { Profile } from '../profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, Profile])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationModule {}