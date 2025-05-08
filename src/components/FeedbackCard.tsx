import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import type { Feedback } from '@/types';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const timeAgo = formatDistanceToNow(new Date(feedback.timestamp), { addSuffix: true });

  const Icon = feedback.type === 'positive' ? ThumbsUp : feedback.type === 'negative' ? ThumbsDown : MessageCircle;
  const iconColor = feedback.type === 'positive' ? 'text-green-500' : feedback.type === 'negative' ? 'text-red-500' : 'text-muted-foreground';

  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Icon className={`h-5 w-5 ${iconColor}`} />
              {feedback.raterName}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">{timeAgo}</CardDescription>
          </div>
          <StarRating rating={feedback.rating} size={16} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground">{feedback.comment}</p>
      </CardContent>
    </Card>
  );
}
