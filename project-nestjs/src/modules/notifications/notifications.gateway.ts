// import {
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   MessageBody,
//   ConnectedSocket,
//   OnGatewayDisconnect,
//   OnGatewayConnection,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { NotificationsService } from './notifications.service';

// @WebSocketGateway({
//   cors: { origin: '*' },
// })
// export class NotificationGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;
//   private users: Map<number, string> = new Map();

//   constructor(private readonly notificationService: NotificationsService) {}

//   // async handleConnection(client: Socket) {
//   //   // Thường bạn sẽ cần client gửi userId joinRoom, nhưng có thể lưu tạm
//   //   console.log('Client connected:', client.id);
//   // }

//   // async handleDisconnect(client: Socket) {
//   //   const userId = [...this.users.entries()].find(
//   //     ([, socketId]) => socketId === client.id,
//   //   )?.[0];
//   //   if (userId !== undefined) {
//   //     this.users.delete(userId);
//   //     console.log(`User ${userId} disconnected`);
//   //   }
//   // }

//   // @SubscribeMessage('joinRoom')
//   // async handleJoinRoom(
//   //   @MessageBody() userId: number,
//   //   @ConnectedSocket() client: Socket,
//   // ) {
//   //   this.users.set(userId, client.id);
//   //   console.log(`User ${userId} joined with socket ID ${client.id}`);

//   //   // Khi user join thì gửi lại toàn bộ notification cho user
//   //   const notifications =
//   //     await this.notificationService.getNotificationsByUserId(userId);
//   //   client.emit('receiveNotifications', notifications);
//   // }

//   // @SubscribeMessage('sendNotification')
//   // async handleSendNotification(@MessageBody() data: any) {
//   //   const { sender_id, receiver_id, content, type = 'info', timestamp } = data;

//   //   // Lưu notification vào DB
//   //   const saved = await this.notificationService.createNotification({
//   //     sender_id,
//   //     receiver_id,
//   //     content,
//   //     type,
//   //     created_at: timestamp ? new Date(timestamp) : new Date(),
//   //     is_read: false,
//   //   });

//   //   // Gửi notification realtime cho receiver nếu đang online
//   //   const socketId = this.users.get(receiver_id);
//   //   if (socketId) {
//   //     this.server.to(socketId).emit('receiveNotification', saved);
//   //     console.log(`Notification sent to user ${receiver_id}`);
//   //   } else {
//   //     console.log(`User ${receiver_id} not connected`);
//   //   }
//   // }
// }
