
export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  currentUsers: number;
  maxCapacity: number;
  adminId?: number;
  topic?: string;
  icon?: string;
  users?: ChatUser[];
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
  reactions?: {
    emoji: string;
    count: number;
    users: number[];
  }[];
}

export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  online: boolean;
  isAdmin?: boolean;
}

export interface Reaction {
  emoji: string;
  count: number;
  users: number[];
}
