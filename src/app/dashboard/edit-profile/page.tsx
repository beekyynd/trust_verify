
import { EditProfileForm } from '@/components/EditProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Profile - TrustVerify',
  description: 'Update your TrustVerify profile information.',
};

export default function EditProfilePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Edit Your Profile</CardTitle>
          <CardDescription>Keep your profile information up to date.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditProfileForm />
        </CardContent>
      </Card>
    </div>
  );
}
