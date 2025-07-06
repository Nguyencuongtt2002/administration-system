import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('messages')
  async getMessages(
    @Query('user1') user1: string,
    @Query('user2') user2: string,
  ) {
    return await this.chatService.getMessages(+user1, +user2);
  }
}
