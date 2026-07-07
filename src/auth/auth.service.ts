import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';


type Payload = {
  email: string;
  sub: number;
  role: UserRole;
};

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  // register new user
  async register(registerDto: RegisterDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.USER,
    });
    const savedUser = await this.userRepository.save(newUser);

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'Registration successful',
    };
  }

  // create admin
  async createAdmin(registerDto: RegisterDto) {

    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }
    const hashedPassword = await this.hashPassword(registerDto.password);
    const newUser = this.userRepository.create({
      email: registerDto.email,
      name: registerDto.name,
      password: hashedPassword,
      role: UserRole.ADMIN,
    });
    const savedUser = await this.userRepository.save(newUser);

    const { password, ...result } = savedUser;
    return {
      user: result,
      message: 'Admin registration successful',
    };
  }

  // login user
  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (
      !user ||
      !(await this.verifyPassword(loginDto.password, user.password))
    ) {
      throw new UnauthorizedException(
        'Account not found or invalid credentials',
      );
    }

    // generate jwt tokens
    const tokens = this.generateTokens(user);
    const { password, ...result } = user;

    return {
      user: result,
      ...tokens,
    };
  }

  // find user by id.
  async getUserById(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...result } = user;
    return result;
  }
  // refresh jwt
  async refreshToken(refreshToken: string) {
    try {
      const payload: Payload = this.jwtService.verify(refreshToken, {
        secret: 'refresh_secret',
      });
      const user = await this.userRepository.findOne({
        where: {
          id: payload.sub,
        },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  // generate password hash
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
  // verify provided password
  private async verifyPassword(
    plainPassword: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hash);
  }
  // generate jwts;
  private generateTokens(user: User) {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    };
  }

  private generateAccessToken(user: User): string {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return this.jwtService.sign(payload, {
      secret: 'jwt_secret',
      expiresIn: '15m',
    });
  }
  private generateRefreshToken(user: User): string {
    const payload = {
      sub: user.id,
    };

    return this.jwtService.sign(payload, {
      secret: 'refresh_secret',
      expiresIn: '7d',
    });
  }
}
