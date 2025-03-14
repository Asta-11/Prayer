import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1542816417-0983c9c9ad53')] bg-cover bg-center">
      <div className="min-h-screen bg-black/60 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Prayer Times</h1>
            <p className="text-gray-200">Stay connected with your daily prayers</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}