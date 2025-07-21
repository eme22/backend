import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login with username and password' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return JWT token and user data',
    schema: {
      properties: {
        access_token: { type: 'string' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async login(@Body() loginDto: { username: string; password: string }) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    
    if (!user) {
      return { success: false, message: 'Invalid credentials' };
    }
    
    return this.authService.login(user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user has been created' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiResponse({ 
    status: 200, 
    description: 'Return new access token',
    schema: {
      properties: {
        access_token: { type: 'string' },
        refresh_token: { type: 'string' },
        user: { 
          type: 'object',
          properties: {
            id: { type: 'number' },
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  async refresh(@Body() refreshDto: { refresh_token: string }) {
    return this.authService.refreshToken(refreshDto.refresh_token);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout and revoke refresh token' })
  @ApiResponse({ status: 200, description: 'Successfully logged out' })
  async logout(@Body() logoutDto: { refresh_token: string }) {
    await this.authService.revokeRefreshToken(logoutDto.refresh_token);
    return { message: 'Successfully logged out' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user profile' })
  @ApiResponse({ status: 200, description: 'Return the user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req) {
    return req.user;
  }
}
