'use client'; 

import { useEffect, useState, use } from 'react';
import Image from 'next/image';
import { StarRating } from '@/components/StarRating';
import { FeedbackCard } from '@/components/FeedbackCard';
import { RatingForm } from '@/components/RatingForm';
import type { UserProfile as UserProfileType, Feedback } from '@/types';
import { getUserById, calculateAverageRating } from '@/lib/data'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ThumbsUp, ThumbsDown, MessageSquare, CalendarDays, UserCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ProfilePageProps {
  params: { userId: string }; 
}

export default function UserProfilePage({ params: incomingParams }: ProfilePageProps) {
  const params = use(incomingParams);

  const [user, setUser] = useState<UserProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // params is now the resolved object from React.use()
    if (params && params.userId) {
      const fetchedUser = getUserById(params.userId);
      if (fetchedUser) {
        setUser(fetchedUser);
      }
    }
    setLoading(false);
  }, [params]); // Depend on the resolved params object

  const handleNewFeedback = (newFeedback: Feedback) => {
    setUser(currentUser => {
      if (!currentUser) return null;
      
      const updatedFeedbackList = [newFeedback, ...currentUser.feedback.filter(fb => fb.id !== newFeedback.id)];

      return {
        ...currentUser,
        feedback: updatedFeedbackList,
        averageRating: calculateAverageRating(updatedFeedbackList) 
      };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-pulse space-y-4 w-full max-w-2xl">
          <div className="h-32 bg-muted rounded-lg"></div>
          <div className="h-8 bg-muted rounded w-3/4"></div>
          <div className="h-24 bg-muted rounded"></div>
          <div className="h-40 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <UserCircle className="mx-auto h-24 w-24 text-destructive mb-4" />
        <h1 className="text-3xl font-bold text-destructive">User Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The profile you are looking for does not exist or may have been removed.
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    );
  }
  
  const positiveFeedbackCount = user.feedback.filter(f => f.type === 'positive').length;
  const negativeFeedbackCount = user.feedback.filter(f => f.type === 'negative').length;
  const neutralFeedbackCount = user.feedback.filter(f => f.type === 'neutral').length;


  return (
    <div className="space-y-8">
      <Button asChild variant="outline" size="sm" className="mb-6">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Link>
      </Button>

      <Card className="overflow-hidden shadow-xl bg-card">
        <CardHeader className="bg-secondary/30 p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Image
              src={user.avatarUrl}
              alt={`${user.name}'s avatar`}
              width={128}
              height={128}
              className="rounded-full border-4 border-primary shadow-lg"
              data-ai-hint="profile avatar large"
              priority
            />
            <div className="text-center sm:text-left">
              <CardTitle className="text-3xl font-bold text-primary">{user.name}</CardTitle>
              {user.bio && <CardDescription className="mt-2 text-md max-w-prose">{user.bio}</CardDescription>}
              <div className="mt-3 flex items-center justify-center sm:justify-start">
                <StarRating rating={user.averageRating} size={24} />
                <span className="ml-3 text-lg text-muted-foreground">
                  ({user.averageRating.toFixed(1)} average from {user.feedback.length} reviews)
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-3 bg-secondary/50 rounded-lg">
                    <ThumbsUp className="h-6 w-6 mx-auto text-green-500 mb-1" />
                    <p className="font-semibold text-lg">{positiveFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                    <MessageSquare className="h-6 w-6 mx-auto text-yellow-500 mb-1" />
                    <p className="font-semibold text-lg">{neutralFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Neutral</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg">
                    <ThumbsDown className="h-6 w-6 mx-auto text-red-500 mb-1" />
                    <p className="font-semibold text-lg">{negativeFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Negative</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2 text-foreground/80">
            <CalendarDays className="h-6 w-6 text-primary" />
            Feedback History
          </h2>
          {user.feedback.length > 0 ? (
            user.feedback.map((fb) => <FeedbackCard key={fb.id} feedback={fb} />)
          ) : (
            <p className="text-muted-foreground italic p-4 bg-card rounded-md shadow-sm">No feedback yet for this user.</p>
          )}
        </div>

        <div className="lg:col-span-1">
            <RatingForm userIdToRate={user.id} onFeedbackSubmitted={handleNewFeedback} />
        </div>
      </div>
    </div>
  );
}
