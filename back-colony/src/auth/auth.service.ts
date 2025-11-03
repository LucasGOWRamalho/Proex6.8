import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ProfilesService } from '../profile/profiles.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private profilesService: ProfilesService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // Buscar usuário por email (precisamos adicionar email ao Profile)
    const user = await this.profilesService.findByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    };
  }

  async register(registerDto: RegisterDto) {
    // Verificar se usuário já existe
    const existingUser = await this.profilesService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Criar perfil
    const user = await this.profilesService.create({
      nome: registerDto.nome,
      email: registerDto.email,
      password: hashedPassword,
      cidade: registerDto.cidade,
      bairro: registerDto.bairro,
    });

    const { password, ...result } = user;

    // Gerar token
    const payload = { email: user.email, sub: user.id };
    
    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user: result,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.profilesService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      const newPayload = { email: user.email, sub: user.id };
      
      return {
        access_token: this.jwtService.sign(newPayload),
        refresh_token: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }
}