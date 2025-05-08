import type { UserProfile, Feedback } from '@/types';

const generateFeedback = (idPrefix: string, baseRating: number): Feedback[] => {
  const feedbackList: Feedback[] = [];
  const numFeedback = Math.floor(Math.random() * 5) + 2; // 2 to 6 feedback items

  for (let i = 0; i < numFeedback; i++) {
    const rating = Math.max(1, Math.min(5, Math.round(baseRating + (Math.random() * 2 - 1)))); // rating around baseRating
    feedbackList.push({
      id: `${idPrefix}-feedback-${i + 1}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      raterName: `User ${Math.floor(Math.random() * 1000)}`,
      rating,
      comment: rating >= 4 ? 'Excellent transaction, highly recommended!' : rating >=3 ? 'Good experience overall.' : 'Could have been better, some issues.',
      type: rating >= 4 ? 'positive' : rating >=3 ? 'neutral' : 'negative',
      timestamp: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(), 
    });
  }
  return feedbackList;
};

export const calculateAverageRating = (feedback: Feedback[]): number => {
  if (feedback.length === 0) return 0;
  const totalRating = feedback.reduce((sum, item) => sum + item.rating, 0);
  return parseFloat((totalRating / feedback.length).toFixed(1));
};

const usersData: Omit<UserProfile, 'averageRating' | 'feedback' | 'id'> & { id?: string }[] = [
  { name: 'Alice Wonderland', email: 'alice@example.com', password: 'password123', avatarUrl: 'https://picsum.photos/100/100?random=1', bio: 'Experienced trader in vintage collectibles. Always fair and communicative.' },
  { name: 'Bob The Builder', email: 'bob@example.com', password: 'password123', avatarUrl: 'https://picsum.photos/100/100?random=2', bio: 'Reliable contractor for all your building needs. Quality work guaranteed.' },
  { name: 'Charlie Brown', email: 'charlie@example.com', password: 'password123', avatarUrl: 'https://picsum.photos/100/100?random=3', bio: 'Friendly neighborhood guy. Sometimes lucky, sometimes not.' },
  { name: 'Diana Prince', email: 'diana@example.com', password: 'password123', avatarUrl: 'https://picsum.photos/100/100?random=4', bio: 'Seeking justice and fair deals. Values honesty and integrity.' },
  { name: 'Edward Scissorhands', email: 'edward@example.com', password: 'password123', avatarUrl: 'https://picsum.photos/100/100?random=5', bio: 'Creative and artistic. Handle with care.' },
];

// Initialize mockUsers with IDs and feedback
export let mockUsers: UserProfile[] = usersData.map((user, index) => {
  const id = (index + 1).toString();
  const baseRatingSeed = (parseInt(id) % 3) + 3; 
  const feedback = generateFeedback(id, baseRatingSeed);
  const averageRating = calculateAverageRating(feedback);
  return {
    ...user,
    id,
    feedback,
    averageRating,
  } as UserProfile; // Added type assertion
});

export const getUserById = (id: string): UserProfile | undefined => {
  const user = mockUsers.find(user => user.id === id);
  if (user) {
    return JSON.parse(JSON.stringify(user));
  }
  return undefined;
};

export const searchUsersByName = (nameQuery: string): UserProfile[] => {
  if (!nameQuery.trim()) return [];
  return JSON.parse(JSON.stringify(mockUsers.filter(user => user.name.toLowerCase().includes(nameQuery.toLowerCase()))));
};

export const addFeedbackToUser = (userId: string, feedback: Omit<Feedback, 'id' | 'timestamp'>): UserProfile | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex > -1) {
    const user = mockUsers[userIndex];
    const newFeedback: Feedback = {
      ...feedback,
      id: `user-${userId}-feedback-${user.feedback.length + 1}-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };
    const updatedFeedback = [newFeedback, ...user.feedback];
    
    mockUsers[userIndex] = {
        ...user,
        feedback: updatedFeedback,
        averageRating: calculateAverageRating(updatedFeedback)
    };
    return JSON.parse(JSON.stringify(mockUsers[userIndex]));
  }
  return undefined;
};

export const findUserByEmail = (email: string): UserProfile | undefined => {
  const user = mockUsers.find(user => user.email.toLowerCase() === email.toLowerCase());
  if (user) {
    return JSON.parse(JSON.stringify(user)); // Return a copy
  }
  return undefined;
};

export const registerUser = (userData: Omit<UserProfile, 'id' | 'averageRating' | 'feedback' | 'avatarUrl'> & {avatarUrl?: string}): UserProfile | null => {
  if (findUserByEmail(userData.email)) {
    return null; // User already exists
  }
  const newUserId = (mockUsers.length + 1).toString();
  const newUser: UserProfile = {
    id: newUserId,
    name: userData.name,
    email: userData.email,
    password: userData.password, // Store password plaintext for mock
    avatarUrl: userData.avatarUrl || `https://picsum.photos/100/100?random=${newUserId}`,
    bio: userData.bio || '',
    feedback: [],
    averageRating: 0,
  };
  mockUsers.push(newUser);
  return JSON.parse(JSON.stringify(newUser)); // Return a copy
};

export const updateUserProfile = (userId: string, updates: Partial<Pick<UserProfile, 'name' | 'bio' | 'avatarUrl'>>): UserProfile | undefined => {
  const userIndex = mockUsers.findIndex(user => user.id === userId);
  if (userIndex > -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
    // If we want to persist this change to the mockUsers array reference in other parts of the app that might import it:
    // This is generally not how you'd do it with a real backend, but for mocks:
    // Re-assign to trigger updates if other modules hold references.
    // This is tricky with module caching. A better approach for mocks is a state management solution or ensuring functions always return fresh copies.
    // For this exercise, modifying the array in place is sufficient as AuthContext will hold its own copy of currentUser.
    return JSON.parse(JSON.stringify(mockUsers[userIndex]));
  }
  return undefined;
};
