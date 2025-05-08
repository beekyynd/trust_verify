
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { FeedbackCard } from '@/components/FeedbackCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit3, ThumbsDown, ThumbsUp, MessageSquare } from 'lucide-react';
import { Metadata } from 'next';

// Cannot export metadata from client component, move to layout or keep as static if possible
// export const metadata: Metadata = {
//   title: 'My Dashboard - TrustVerify',
//   description: 'View your reviews and manage your profile on TrustVerify.',
// };


export default function DashboardPage() {
  const { currentUser } = useAuth(); // Layout handles redirect if !currentUser or !isAuthenticated

  if (!currentUser) {
    // This case should ideally not be reached due to layout protection
    return <p>Loading user data or redirecting...</p>;
  }
  
  const positiveFeedbackCount = currentUser.feedback.filter(f => f.type === 'positive').length;
  const negativeFeedbackCount = currentUser.feedback.filter(f => f.type === 'negative').length;
  const neutralFeedbackCount = currentUser.feedback.filter(f => f.type === 'neutral').length;

  return (
    <div className="space-y-8">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-secondary/30 p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <Image
              src={currentUser.avatarUrl}
              alt={`${currentUser.name}'s avatar`}
              width={100}
              height={100}
              className="rounded-full border-4 border-primary shadow-lg"
              data-ai-hint="dashboard avatar"
              priority
            />
            <div className="flex-grow">
              <CardTitle className="text-3xl font-bold text-primary mb-1">Welcome, {currentUser.name}!</CardTitle>
              <CardDescription className="text-md max-w-prose mb-2">{currentUser.bio || "Edit your profile to add a bio."}</CardDescription>
              <div className="flex items-center">
                <StarRating rating={currentUser.averageRating} size={22} />
                <span className="ml-3 text-md text-muted-foreground">
                  ({currentUser.averageRating.toFixed(1)} average from {currentUser.feedback.length} reviews)
                </span>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/edit-profile">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-foreground/90 mb-4">Your Feedback Summary</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-card rounded-lg shadow-sm">
                    <ThumbsUp className="h-6 w-6 mx-auto text-green-500 mb-1" />
                    <p className="font-semibold text-lg">{positiveFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Positive</p>
                </div>
                <div className="p-3 bg-card rounded-lg shadow-sm">
                    <MessageSquare className="h-6 w-6 mx-auto text-yellow-500 mb-1" />
                    <p className="font-semibold text-lg">{neutralFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Neutral</p>
                </div>
                <div className="p-3 bg-card rounded-lg shadow-sm">
                    <ThumbsDown className="h-6 w-6 mx-auto text-red-500 mb-1" />
                    <p className="font-semibold text-lg">{negativeFeedbackCount}</p>
                    <p className="text-xs text-muted-foreground">Negative</p>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-foreground/80">Reviews About You</h2>
        {currentUser.feedback.length > 0 ? (
          <div className="space-y-4">
            {currentUser.feedback.map((fb) => (
              <FeedbackCard key={fb.id} feedback={fb} />
            ))}
          </div>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center">You haven&apos;t received any feedback yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
