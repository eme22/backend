import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { RefreshToken } from '../../entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log('AuthService - Validating user:', username);
    try {
      const user = await this.usersService.findByUsername(username);
      console.log('AuthService - Found user:', user ? 'YES' : 'NO');
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('AuthService - Password valid:', isPasswordValid);

      if (isPasswordValid) {
        const { password, ...result } = user;
        console.log('AuthService - Returning user result:', result);
        return result;
      }
      
      console.log('AuthService - Password validation failed');
      return null;
    } catch (error) {
      console.log('AuthService - Error validating user:', error);
      return null;
    }
  }

  async login(user: any) {
    console.log('AuthService - Login called with user:', user);
    const payload = { username: user.username, sub: user.user_id, role: user.role };
    console.log('AuthService - JWT payload:', payload);
    
    // Generate access token
    const accessToken = this.jwtService.sign(payload);
    console.log('AuthService - Generated access token:', accessToken);
    
    // Generate refresh token
    const refreshToken = this.jwtService.sign(
      { sub: user.user_id, type: 'refresh' },
      {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiresIn'),
      }
    );
    
    // Store refresh token in database
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7); // 7 days from now
    
    await this.refreshTokenRepository.save({
      token: refreshToken,
      user_id: user.user_id,
      expires_at: refreshTokenExpiry,
    });
    
    const result = {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
    
    console.log('AuthService - Login result:', result);
    return result;
  }

  async register(userData: any) {
    const user = await this.usersService.create(userData);
    const { password, ...result } = user;
    
    return result;
  }

  async refreshToken(refreshToken: string) {
    console.log('AuthService - Refresh token called with:', refreshToken);
    
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.refreshSecret'),
      });
      
      console.log('AuthService - Refresh token payload:', payload);
      
      // Check if refresh token exists in database and is not revoked
      const tokenRecord = await this.refreshTokenRepository.findOne({
        where: { token: refreshToken, is_revoked: false },
        relations: ['user'],
      });
      
      if (!tokenRecord || tokenRecord.expires_at < new Date()) {
        console.log('AuthService - Refresh token not found or expired');
        throw new UnauthorizedException('Invalid refresh token');
      }
      
      // Generate new access token
      const newPayload = { 
        username: tokenRecord.user.username, 
        sub: tokenRecord.user.user_id, 
        role: tokenRecord.user.role 
      };
      
      const newAccessToken = this.jwtService.sign(newPayload);
      
      console.log('AuthService - New access token generated:', newAccessToken);
      
      return {
        access_token: newAccessToken,
        refresh_token: refreshToken, // Keep the same refresh token
        user: {
          id: tokenRecord.user.user_id,
          username: tokenRecord.user.username,
          email: tokenRecord.user.email,
          role: tokenRecord.user.role,
        },
      };
    } catch (error) {
      console.log('AuthService - Error refreshing token:', error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async revokeRefreshToken(refreshToken: string) {
    await this.refreshTokenRepository.update(
      { token: refreshToken },
      { is_revoked: true }
    );
  }
}
