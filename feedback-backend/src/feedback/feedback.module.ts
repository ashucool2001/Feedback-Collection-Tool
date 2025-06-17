import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [PassportModule, JwtModule, SocketModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, PrismaService],
})
export class FeedbackModule {}