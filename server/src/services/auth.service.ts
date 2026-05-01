import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import { ApiError } from '../utils/ApiError';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  static async register(name: string, email: string, passwordRaw: string) {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      throw ApiError.conflict('User with this email already exists');
    }

    const password = await bcrypt.hash(passwordRaw, 10);
    const user = userRepository.create({ name, email, password });
    await userRepository.save(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async login(email: string, passwordRaw: string) {
    const user = await userRepository.findOne({
      where: { email },
      select: ['id', 'name', 'email', 'password', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(passwordRaw, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  static async getMe(userId: string) {
    const user = await userRepository.findOneBy({ id: userId });
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    return user;
  }
}
