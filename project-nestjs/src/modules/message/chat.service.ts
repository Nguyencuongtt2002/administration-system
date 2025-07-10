import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { MessageReaction } from './entities/message-reaction.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    @InjectRepository(MessageReaction)
    private readonly reactionRepo: Repository<MessageReaction>,
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
      relations: ['replyToMessage', 'reactions'],
    });
  }

  async findMessageById(messageId: number) {
    return await this.messageRepo.findOne({
      where: { id: messageId },
    });
  }

  async addReaction(messageId: number, userId: number, emoji: string) {
    const message = await this.messageRepo.findOneBy({ id: messageId });
    if (!message) throw new Error('Message không tồn tại');

    const existing = await this.reactionRepo.findOne({
      where: { messageId, userId },
    });

    if (existing) {
      existing.emoji = emoji;
      return await this.reactionRepo.save(existing);
    }

    const reaction = this.reactionRepo.create({
      messageId,
      userId,
      emoji,
    });

    console.log(reaction);

    return await this.reactionRepo.save(reaction);
  }
}
