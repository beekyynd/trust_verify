import { UserSearch } from '@/components/UserSearch';

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="text-center py-8 bg-card rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to TrustVerify</h1>
        <p className="text-lg text-card-foreground max-w-2xl mx-auto">
          Find and rate users you've done business with. Help build a community of trust and transparency.
        </p>
      </section>
      
      <section>
        <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left text-foreground/80">
          Search for a User or Browse Profiles
        </h2>
        <UserSearch />
      </section>
    </div>
  );
}
