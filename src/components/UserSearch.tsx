'use client';

import { useState, useEffect, useTransition } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserProfileCard } from '@/components/UserProfileCard';
import type { UserProfile } from '@/types';
import { searchUsersByName as searchUsersAction, mockUsers } from '@/lib/data'; // Using mock data directly
import { Loader2, SearchIcon, Frown } from 'lucide-react';

export function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [isSearching, startSearchTransition] = useTransition();
  const [hasSearched, setHasSearched] = useState(false);

  // Show some initial users before any search
  const [initialUsers, setInitialUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Select a few random users from mockUsers to display initially
    const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
    setInitialUsers(shuffled.slice(0, 3));
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false); // Reset if query is empty
      return;
    }
    setHasSearched(true);
    startSearchTransition(() => {
      const foundUsers = searchUsersAction(query);
      setResults(foundUsers);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSearch();
  };
  
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!e.target.value.trim()) { // Clear results if input is cleared
                 setResults([]);
                 setHasSearched(false);
            }
          }}
          placeholder="Search for a user by name..."
          className="flex-grow text-base"
          aria-label="Search users"
        />
        <Button type="submit" disabled={isSearching} className="px-6">
          {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <SearchIcon className="h-5 w-5" />}
          <span className="ml-2 hidden sm:inline">Search</span>
        </Button>
      </form>

      {hasSearched && results.length === 0 && !isSearching && (
        <div className="text-center py-10 bg-card rounded-lg shadow">
          <Frown className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-card-foreground">No users found for "{query}"</p>
          <p className="text-muted-foreground">Try a different name or check your spelling.</p>
        </div>
      )}

      {(results.length > 0 || (!hasSearched && initialUsers.length > 0)) && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(results.length > 0 ? results : initialUsers).map((user) => (
            <UserProfileCard key={user.id} user={user} />
          ))}
        </div>
      )}
       {!hasSearched && initialUsers.length === 0 && (
         <p className="text-center text-muted-foreground">No sample users to display. Start a search!</p>
       )}
    </div>
  );
}
