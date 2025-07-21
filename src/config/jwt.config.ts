import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: process.env.JWT_EXPIRATION_TIME || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret_key_here',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME || '7d',
}));
