import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  return (
    <main className="min-h-screen bg-[url('/images/mosque.jpg')] bg-cover bg-center flex items-center justify-center p-4">
      <LoginForm />
    </main>
  );
}