import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from './jwt.config';
import { Payload, Validated } from './jwt.payload';
import { UserService } from '../../user/user.service';
import { StylistService } from '../../stylist/stylist.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY) private config: ConfigType<typeof jwtConfig>,
    private userService: UserService,
    private stylistService: StylistService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretKey,
    });
  }

  async validate(payload: Payload): Promise<Validated> {
    // userType에 따라 적절한 서비스에서 사용자 확인
    if (payload.userType === 'user') {
      try {
        await this.userService.readById(payload.id);
      } catch {
        throw new UnauthorizedException('User not found');
      }
    } else if (payload.userType === 'stylist') {
      try {
        await this.stylistService.findById(payload.id);
      } catch {
        throw new UnauthorizedException('Stylist not found');
      }
    } else {
      throw new UnauthorizedException('Invalid user type');
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      userType: payload.userType,
    };
  }
}
