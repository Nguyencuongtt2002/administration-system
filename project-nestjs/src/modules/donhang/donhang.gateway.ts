import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '@/notifications/notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DonHangGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(
    private notificationsService: NotificationsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(socket: Socket) {
    const { Authorization } = socket.handshake.auth;

    const decoded = this.jwtService.decode(
      Authorization.replace('Bearer ', ''),
    ) as any;
    const userId = decoded?.MaNguoiDung;
    if (!userId) {
      console.log('Không có userId trong token');
      return;
    }

    socket.join(userId.toString());
  }
  @SubscribeMessage('sendNotification')
  handleNotification(@MessageBody() data: any) {
    const { receiver_id, content } = data;
    this.server.to(receiver_id.toString()).emit('receiveNotification', {
      content,
      timestamp: new Date().toISOString(),
    });
  }

  async sendOrderNotification({
    senderId,
    receiverId,
    content,
  }: {
    senderId: number;
    receiverId: number;
    content: string;
  }) {
    // Lưu vào DB
    await this.notificationsService.createNotification(
      senderId,
      receiverId,
      'order', // type là 'order'
      content,
    );

    // Gửi real-time qua socket
    this.server.to(receiverId.toString()).emit('receiveNotification', {
      content,
      type: 'order',
      timestamp: new Date().toISOString(),
    });
  }
}
