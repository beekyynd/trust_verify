'use client';

import { Star, StarHalf, StarOff } from 'lucide-react';
import type { LucideProps } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  size?: number;
  className?: string;
  iconClassName?: string;
  onRate?: (rating: number) => void;
  isInteractive?: boolean;
}

export function StarRating({
  rating,
  totalStars = 5,
  size = 20,
  className = '',
  iconClassName = 'text-amber-400',
  onRate,
  isInteractive = false,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = totalStars - fullStars - (halfStar ? 1 : 0);

  const starProps: Omit<LucideProps, 'ref'> = {
    size,
    className: cn('shrink-0', iconClassName, isInteractive ? 'cursor-pointer hover:scale-110 transition-transform' : ''),
  };

  const handleStarClick = (index: number) => {
    if (onRate && isInteractive) {
      onRate(index + 1);
    }
  };
  
  // For interactive display, all stars are potentially clickable
  if (isInteractive) {
    return (
      <div className={cn("flex items-center gap-0.5", className)}>
        {[...Array(totalStars)].map((_, index) => (
          <Star
            key={index}
            {...starProps}
            fill={index < rating ? 'currentColor' : 'none'}
            onClick={() => handleStarClick(index)}
          />
        ))}
      </div>
    );
  }

  // For display-only
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} {...starProps} fill="currentColor" />
      ))}
      {halfStar && <StarHalf key="half" {...starProps} fill="currentColor" />}
      {[...Array(Math.max(0, emptyStars))].map((_, i) => (
         <Star key={`empty-${i}`} {...starProps} fill="none" className={cn(starProps.className, 'text-muted-foreground/50')} />
      ))}
      {rating === 0 && totalStars > 0 && [...Array(totalStars)].map((_, i) => (
        <StarOff key={`off-${i}`} {...starProps} className={cn(starProps.className, 'text-muted-foreground/50')} />
      ))}
    </div>
  );
}

// Helper for cn if not globally available or for specific context
// For ShadCN projects, cn is usually in @/lib/utils
const cn = (...inputs: any[]) => inputs.filter(Boolean).join(' ');
