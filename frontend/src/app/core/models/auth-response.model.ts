import { User } from './user.model';

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}