import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { UserRole } from '../entities/user.entity';

type Payload = {
  email: string;
  sub: number;
  role: UserRole;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'jwt_secret',
      ignoreExpiration: false,
    });
  }

  async validate(payload: Payload) {
    try {
      const user = await this.authService.getUserById(payload.sub);
      return {
        ...user,
        role: payload.role,
      };
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token!');
    }
  }
}
