
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Loader2, Save } from 'lucide-react';
import type { UserProfile } from '@/types';

const editProfileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50, { message: 'Name cannot exceed 50 characters.' }),
  bio: z.string().max(300, { message: 'Bio cannot exceed 300 characters.' }).optional(),
  avatarUrl: z.string().url({ message: 'Please enter a valid URL for your avatar.' }).optional().or(z.literal('')),
});

type EditProfileFormValues = z.infer<typeof editProfileFormSchema>;

export function EditProfileForm() {
  const { currentUser, updateProfile } = useAuth();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileFormSchema),
    defaultValues: {
      name: currentUser?.name || '',
      bio: currentUser?.bio || '',
      avatarUrl: currentUser?.avatarUrl || '',
    },
  });

  const onSubmit = (values: EditProfileFormValues) => {
    startTransition(async () => {
      const updatedProfileData: Partial<Pick<UserProfile, 'name' | 'bio' | 'avatarUrl'>> = {
        name: values.name,
        bio: values.bio || '', // Ensure bio is empty string if not provided
        avatarUrl: values.avatarUrl || (currentUser?.avatarUrl || `https://picsum.photos/100/100?random=${currentUser?.id}`), // Keep old or default if empty
      };
      
      const updatedUser = await updateProfile(updatedProfileData);
      if (updatedUser) {
        // Optionally, redirect or show success message (toast is handled in AuthContext)
        router.refresh(); // Refresh current page data
      }
    });
  };

  if (!currentUser) return <p>Loading profile...</p>;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us a bit about yourself..." className="resize-y min-h-[100px]" {...field} />
              </FormControl>
              <FormDescription>A short description about you (max 300 characters).</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://example.com/avatar.png" {...field} />
              </FormControl>
              <FormDescription>Link to your profile picture.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" /> : <Save />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
