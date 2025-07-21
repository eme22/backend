import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.secret'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - Validating payload:', payload);
    console.log('JWT Strategy - Secret being used:', this.configService.get('jwt.secret'));
    
    const user = { 
      userId: payload.sub, 
      username: payload.username,
      role: payload.role,
    };
    
    console.log('JWT Strategy - Returning user:', user);
    return user;
  }
}
