export interface IQueryMessgae {
  user1: string
  user2: string
}

export interface IMessage {
  id?: number
  senderId: number
  receiverId: number
  content: string
  createdAt?: string
  timestamp: string
  replyToMessageId?: number
  replyToMessage?: {
    id: 89
    senderId: number
    receiverId: number
    content: string
    createdAt: string
  }
  reactions?: { userId: number; emoji: string }[]
}
