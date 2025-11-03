import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Between } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Profile } from '../profile/profile.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    // Verificar se o autor existe
    const autor = await this.profileRepo.findOne({
      where: { id: createPostDto.autorId }
    });
    
    if (!autor) {
      throw new NotFoundException('Perfil do autor não encontrado');
    }

    const post = this.postRepo.create({
      ...createPostDto,
      autor,
      criadoEm: new Date(),
    });

    return await this.postRepo.save(post);
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['autor'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post com ID ${id} não encontrado`);
    }
    
    return post;
  }

  async findAll(): Promise<Post[]> {
    return await this.postRepo.find({
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    const post = await this.findOne(id);
    
    // Se estiver atualizando o autor, verificar se existe
    if (updatePostDto.autorId) {
      const autor = await this.profileRepo.findOne({
        where: { id: updatePostDto.autorId }
      });
      
      if (!autor) {
        throw new NotFoundException('Perfil do autor não encontrado');
      }
      
      post.autor = autor;
    }

    Object.assign(post, updatePostDto);
    return await this.postRepo.save(post);
  }

  async remove(id: string): Promise<void> {
    const post = await this.findOne(id);
    await this.postRepo.remove(post);
  }

  // 🔍 BUSCA DE POSTS
  async search(searchTerm: string): Promise<Post[]> {
    return await this.postRepo.find({
      where: [
        { descricao: ILike(`%${searchTerm}%`) },
        { localizacao: ILike(`%${searchTerm}%`) },
        { tipoAnimal: ILike(`%${searchTerm}%`) },
      ],
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  // 🗺️ BUSCA POR LOCALIZAÇÃO
  async findNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<Post[]> {
    // Fórmula aproximada: 1 grau ≈ 111 km
    const degreeRange = radiusKm / 111;
    
    return await this.postRepo.find({
      where: {
        latitude: Between(latitude - degreeRange, latitude + degreeRange),
        longitude: Between(longitude - degreeRange, longitude + degreeRange),
      },
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  // 🐕 BUSCA POR TIPO DE ANIMAL
  async findByAnimalType(tipoAnimal: string): Promise<Post[]> {
    return await this.postRepo.find({
      where: { tipoAnimal: ILike(`%${tipoAnimal}%`) },
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  // 📊 BUSCA POR STATUS
  async findByStatus(status: string): Promise<Post[]> {
    return await this.postRepo.find({
      where: { status: ILike(`%${status}%`) },
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }

  // 👤 POSTS POR USUÁRIO
  async findByUser(autorId: string): Promise<Post[]> {
    return await this.postRepo.find({
      where: { autor: { id: autorId } },
      relations: ['autor'],
      order: { criadoEm: 'DESC' },
    });
  }
}