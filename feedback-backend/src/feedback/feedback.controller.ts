import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('submit')
  async submit(@Body() body: any) {
    console.log('Received feedback submission:', body);
    const { name, email, content, rating, product } = body;
    if (!content || !rating || !product) {
      return { error: 'Content, rating, and product are required' };
    }
    return this.feedbackService.createFeedback({ name, email, content, rating, product });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAll(@Query('sortBy') sortBy: string, @Query('order') order: 'asc' | 'desc') {
    return this.feedbackService.getAllFeedbacks(sortBy, order);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  async getStats() {
    return this.feedbackService.getStats();
  }
}