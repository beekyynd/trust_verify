import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StarRating } from '@/components/StarRating';
import type { UserProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface UserProfileCardProps {
  user: UserProfile;
}

export function UserProfileCard({ user }: UserProfileCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out bg-card text-card-foreground">
      <CardHeader className="flex flex-row items-center gap-4">
        <Image
          src={user.avatarUrl}
          alt={`${user.name}'s avatar`}
          width={64}
          height={64}
          className="rounded-full border-2 border-primary"
          data-ai-hint="profile avatar"
        />
        <div>
          <CardTitle className="text-xl font-semibold text-primary">{user.name}</CardTitle>
          <div className="flex items-center mt-1">
            <StarRating rating={user.averageRating} size={18} />
            <span className="ml-2 text-sm text-muted-foreground">({user.feedback.length} reviews)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.bio && <CardDescription className="mb-4 line-clamp-2">{user.bio}</CardDescription>}
        <Button asChild variant="outline" className="w-full group">
          <Link href={`/profile/${user.id}`}>
            View Profile
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
