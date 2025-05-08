
export interface Feedback {
  id: string;
  raterName: string;
  rating: number; // 1-5
  comment: string;
  type: 'positive' | 'negative' | 'neutral';
  timestamp: string; // ISO date string
}

export interface UserProfile {
  id: string;
  name: string;
  email: string; // Added for login
  password?: string; // Added for login, plain text for mock
  avatarUrl: string;
  averageRating: number;
  feedback: Feedback[];
  bio?: string;
}
