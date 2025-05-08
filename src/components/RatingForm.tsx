'use client';

import { useState, useTransition } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/StarRating';
import { addFeedbackToUser } from '@/lib/data'; // Simulated action
import { useToast } from '@/hooks/use-toast';
import type { Feedback } from '@/types';
import { Loader2, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from './ui/input';


const ratingFormSchema = z.object({
  raterName: z.string().min(2, { message: "Name must be at least 2 characters."}).max(50, { message: "Name cannot exceed 50 characters."}),
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }).max(500, { message: "Comment cannot exceed 500 characters." }),
});

type RatingFormValues = z.infer<typeof ratingFormSchema>;

interface RatingFormProps {
  userIdToRate: string;
  onFeedbackSubmitted?: (newFeedback: Feedback) => void;
}

export function RatingForm({ userIdToRate, onFeedbackSubmitted }: RatingFormProps) {
  const [isSubmitting, startSubmitTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<RatingFormValues>({
    resolver: zodResolver(ratingFormSchema),
    defaultValues: {
      raterName: '',
      rating: 0,
      comment: '',
    },
  });

  function onSubmit(data: RatingFormValues) {
    startSubmitTransition(() => {
      const feedbackType: Feedback['type'] = data.rating >= 4 ? 'positive' : data.rating >= 3 ? 'neutral' : 'negative';
      
      // Simulate adding feedback
      const updatedUser = addFeedbackToUser(userIdToRate, {
        ...data,
        type: feedbackType,
      });

      if (updatedUser) {
        toast({
          title: "Rating Submitted!",
          description: "Your feedback has been successfully recorded.",
          variant: "default",
        });
        form.reset(); // Reset form after successful submission
        if (onFeedbackSubmitted && updatedUser.feedback.length > 0) {
           // Assuming addFeedbackToUser adds the new feedback to the beginning
          onFeedbackSubmitted(updatedUser.feedback[0]);
        }
        router.refresh(); // Refresh server components data
      } else {
        toast({
          title: "Error",
          description: "Failed to submit feedback. User not found.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-lg shadow-md bg-card">
        <h3 className="text-xl font-semibold text-primary">Rate this User</h3>
        
        <FormField
          control={form.control}
          name="raterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Rating</FormLabel>
              <FormControl>
                <StarRating 
                  rating={field.value} 
                  onRate={(rate) => field.onChange(rate)} 
                  isInteractive 
                  size={28}
                  className="py-1"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Comment</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us about your experience with this user..."
                  className="resize-y min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Submit Rating
        </Button>
      </form>
    </Form>
  );
}
