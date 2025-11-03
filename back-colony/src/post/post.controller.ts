import {
  Controller, Get, Post, Body, Param, Patch, Delete, Query, ParseUUIDPipe, ParseFloatPipe, DefaultValuePipe,} from '@nestjs/common';
import { PostsService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get('search')
  search(@Query('q') searchTerm: string) {
    return this.postsService.search(searchTerm);
  }

  @Get('nearby')
  findNearby(
    @Query('lat', ParseFloatPipe) lat: number,
    @Query('lng', ParseFloatPipe) lng: number,
    @Query('radius', new DefaultValuePipe(10), ParseFloatPipe) radius: number,
  ) {
    return this.postsService.findNearby(lat, lng, radius);
  }

  @Get('animal/:type')
  findByAnimalType(@Param('type') type: string) {
    return this.postsService.findByAnimalType(type);
  }

  @Get('status/:status')
  findByStatus(@Param('status') status: string) {
    return this.postsService.findByStatus(status);
  }

  @Get('user/:userId')
  findByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.postsService.findByUser(userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }
}