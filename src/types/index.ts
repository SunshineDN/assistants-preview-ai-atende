export interface AIModel {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'offline' | 'busy';
  avatar: string;
  specialties: string[];
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  aiId?: string;
}

export interface Conversation {
  id: string;
  aiId: string;
  aiName: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  isActive: boolean;
}

export interface ChatState {
  activeConversations: Conversation[];
  conversationHistory: Conversation[];
  selectedAIs: string[];
  isHistoryOpen: boolean;
}