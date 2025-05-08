
import { LoginForm } from '@/components/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - TrustVerify',
  description: 'Login to your TrustVerify account.',
};

interface LoginPageProps {
  searchParams?: {
    redirect?: string;
  };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectUrl = searchParams?.redirect;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-250px)] py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back!</CardTitle>
          <CardDescription>Sign in to continue to TrustVerify.</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm redirectUrl={redirectUrl} />
        </CardContent>
      </Card>
    </div>
  );
}
