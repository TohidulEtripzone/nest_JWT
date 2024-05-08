import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

import { Response, Request } from 'express';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}




  async register(name: string, email: string, password: string): Promise<User | undefined> {
    // Validate email
    if (!email || !email.trim()) {
      throw new BadRequestException('Email is required');
    }
    // Validate password
    if (!password || !password.trim()) {
      throw new BadRequestException('Password is required');
    }
    // Check if user with provided email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Create the user entity
    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.password = hashedPassword;
    // Save the user to the database
    return this.userService.create(newUser);
  }


  async login(email: string, password: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.jwtService.sign({ email: user.email });
  }

  async getUser(request: Request): Promise<any> {
    try {
      const token = request.cookies['token'];
      if (!token) {
        throw new UnauthorizedException('JWT token not found');
      }
      const decodedToken = this.jwtService.verify(token);
      const user = await this.userService.findOne(decodedToken.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      const { password, ...result } = user;
      return result;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
