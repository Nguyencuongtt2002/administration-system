import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async saveMessage(data: {
    senderId: number;
    receiverId: number;
    content: string;
    replyToMessageId?: number;
  }) {
    const message = this.messageRepo.create({
      senderId: data.senderId,
      receiverId: data.receiverId,
      content: data.content,
      replyToMessage: data.replyToMessageId
        ? { id: data.replyToMessageId }
        : undefined,
    });

    await this.messageRepo.save(message);

    return await this.messageRepo.findOne({
      where: { id: message.id },
      relations: ['replyToMessage'],
    });
  }

  async getMessages(user1: number, user2: number) {
    return this.messageRepo.find({
      where: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
      order: { createdAt: 'ASC' },
      relations: ['replyToMessage'],
    });
  }
}
