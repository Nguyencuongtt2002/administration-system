// src/notifications/notifications.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notifications } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notifications)
    private notificationsRepo: Repository<Notifications>,
  ) {}

  /**
   * 📥 Tạo thông báo
   */
  async createNotification(
    sender_id: number,
    receiver_id: number,
    type: string,
    content: string,
  ) {
    const noti = this.notificationsRepo.create({
      sender_id,
      receiver_id,
      type,
      content,
    });
    return this.notificationsRepo.save(noti);
  }

  /**
   * 📄 Lấy danh sách thông báo theo người dùng
   */
  async getNotificationsByReceiver(receiver_id: number, page = 1, limit = 10) {
    const [data, total] = await this.notificationsRepo.findAndCount({
      where: { receiver_id },
      order: { created_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    console.log(data, total, page, limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * ✅ Đánh dấu đã đọc
   */
  async markAsRead(notificationId: number) {
    return this.notificationsRepo.update(notificationId, { is_read: true });
  }
}
