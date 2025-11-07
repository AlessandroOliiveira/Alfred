export * from './user';
export * from './routine';
export * from './finance';
export * from './study';
export * from './fiverr';
export * from './planning';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  id: string;
  userId: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}
