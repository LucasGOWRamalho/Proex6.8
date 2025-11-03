import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ProfilesService } from '../profile/profiles.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private profilesService: ProfilesService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'colony_app_secret_key_2024',
    });
  }

  async validate(payload: any) {
    const user = await this.profilesService.findOne(payload.sub);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
    };
  }
}