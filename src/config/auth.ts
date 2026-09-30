import * as dotenv from 'dotenv';

dotenv.config();

export default {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
  expiresIn: '1h', // thời gian hết hạn của token
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret',   
  refreshExpiresIn: '7d',
};
