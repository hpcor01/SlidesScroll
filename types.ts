export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string;
  role: Role;
  password?: string; // simplified for demo
}

export interface Article {
  id: string;
  subject: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string; // ISO Date string
  type: 'TEXT' | 'PPTX';
  fileName?: string; // For PPTX uploads
}

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  originalId?: string;
  similarArticleAuthor?: string; // New field for the author name
  reason?: string;
}