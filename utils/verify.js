import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function jwtdecode(token) {
  return jwt.decode(token);
}