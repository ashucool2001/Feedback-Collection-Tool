import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async validateAdmin(email: string, password: string) {
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return admin;
  }

  async login(email: string, password: string) {
    const admin = await this.validateAdmin(email, password);
    const payload = { email: admin.email, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async seedAdmin() {
    const existing = await this.prisma.admin.findFirst();
    if (!existing) {
      const hashed = await bcrypt.hash('admin123', 10);
      await this.prisma.admin.create({
        data: { email: 'admin@example.com', password: hashed },
      });
    }
  }
}