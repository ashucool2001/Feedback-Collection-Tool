import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class FeedbackService {
  constructor(
    private prisma: PrismaService,
    private socketGateway: SocketGateway
  ) {}

  async createFeedback(data: {
    name?: string;
    email?: string;
    content: string;
    rating: number;
    product: string;
  }) {
    const feedback = await this.prisma.feedback.create({ data: {
      ...data,
      rating: Number(data.rating),
    } });
    this.socketGateway.broadcastFeedbackUpdate();
    return feedback;
  }

  async getAllFeedbacks(sortBy: string = 'createdAt', order: 'asc' | 'desc' = 'desc') {
    return this.prisma.feedback.findMany({
      orderBy: { [sortBy]: order },
    });
  }

  async getStats() {
    const total = await this.prisma.feedback.count();
    const avg = await this.prisma.feedback.aggregate({
      _avg: { rating: true },
    });
    return {
      totalFeedbacks: total,
      averageRating: avg._avg.rating || 0,
    };
  }
}