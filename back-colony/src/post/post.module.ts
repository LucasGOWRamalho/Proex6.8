import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';
import { Profile } from '../profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, Profile])],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostModule {}