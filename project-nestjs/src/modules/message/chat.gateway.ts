import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
  WsException,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  private onlineUsers = new Set<number>();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(@MessageBody() data: any) {
    try {
      const message = await this.chatService.saveMessage(data);

      this.server
        .to(data.receiverId.toString())
        .emit('receiveMessage', message);
    } catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Lỗi khi gửi tin nhắn');
    }
  }

  @SubscribeMessage('resetUnread')
  handleResetUnread(@MessageBody() data: { userId: number }) {
    this.server.to(data.userId.toString()).emit('resetUnread');
  }

  handleConnection(socket: Socket) {
    const { Authorization } = socket.handshake.auth;

    try {
      const decoded = this.jwtService.decode(
        Authorization.replace('Bearer ', ''),
      ) as any;

      const userId = decoded?.MaNguoiDung;
      if (!userId) {
        console.log('Không có userId trong token');
        return;
      }

      socket.data.userId = userId;
      socket.join(userId.toString());

      this.onlineUsers.add(userId);

      this.server.emit('onlineUsers', Array.from(this.onlineUsers));
    } catch (error) {
      console.error('Token decode error:', error.message);
    }
  }

  // @SubscribeMessage('getOnlineUsers')
  // handleGetOnlineUsers(@ConnectedSocket() client: Socket) {
  //   const onlineUserIds = Array.from(this.onlineUsers); // chuyển Set => Array
  //   console.log(onlineUserIds);

  //   client.emit('onlineUsers', onlineUserIds);
  // }

  handleDisconnect(socket: Socket) {
    const userId = socket.data.userId;
    if (userId) {
      this.onlineUsers.delete(userId);
      this.server.emit('onlineUsers', Array.from(this.onlineUsers));
    }
  }

  //socket.on(eventName, callback)
  // Lắng nghe (nghe ngóng) sự kiện được gửi đến, và xử lý khi có sự kiện đó.

  //socket.emit(eventName, data)
  // Gửi dữ liệu (phát sự kiện) từ một phía (client hoặc server) đến phía còn lại.
  //Client → Server hoặc Server → Client

  //socket.off(eventName)
  //Gỡ bỏ listener (ngừng lắng nghe) một sự kiện đã đăng ký với .on()
}
