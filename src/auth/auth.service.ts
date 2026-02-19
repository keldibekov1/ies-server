import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, ResetAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: CreateAuthDto) {
    let user = await this.prisma.user.findUnique({
      where: { username: data.username },
    });

    if (!user) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    let isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Username or password is incorrect');
    }

    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
      iat: Math.floor(Date.now() / 1000),
    });

    return { token };
  }
}
