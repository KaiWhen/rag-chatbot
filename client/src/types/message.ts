export interface Message {
  type: 'user' | 'assistant' | 'system';
  content: string;
}
