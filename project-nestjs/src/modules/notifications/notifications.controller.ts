import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('receiver/:id')
  getByReceiver(
    @Param('id') receiverId: number,
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ) {
    return this.notificationsService.getNotificationsByReceiver(
      receiverId,
      parseInt(page),
      parseInt(limit),
    );
  }
}
