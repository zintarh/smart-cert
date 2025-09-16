'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { loginSchema, type LoginFormData } from '@/lib/validations';

import { Button, Input } from '@/components/ui';
import { useAuth } from '@/lib/auth-store';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: data.email,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Login successful!');
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex relative">
      {/* Header */}
      <div className="absolute top-6 left-6 text-gray-600 text-sm font-medium z-20">Login</div>
      
      {/* Left Section - Promotional (40% width) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-16 py-20 text-white">
          <h1 className="text-5xl font-bold mb-10 leading-tight">
            Start issuing verifiable credentials
          </h1>
          <div className="space-y-8">
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg leading-relaxed">Enable secure data exchanges with fraud-proof data</p>
            </div>
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg leading-relaxed">Convert verified ID data into Reusable Digital credentials</p>
            </div>
            <div className="flex items-start space-x-5">
              <div className="flex-shrink-0 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-1">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg leading-relaxed">Reduce verification friction without compromising security</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Login Form (60% width) */}
      <div className="w-full lg:w-3/5 flex flex-col justify-center px-12 py-16 bg-white">
        <div className="max-w-md mx-auto w-full">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="relative w-10 h-10">
              <div className="absolute w-6 h-6 bg-blue-500 transform rotate-45 top-1 left-1"></div>
              <div className="absolute w-6 h-6 bg-yellow-400 transform rotate-45 top-2 left-2"></div>
            </div>
            <span className="text-2xl font-bold text-black">SmartCert</span>
          </div>

          {/* Form Header */}
          <h2 className="text-3xl font-bold text-black mb-3">Log in to your account</h2>
          <p className="text-gray-600 mb-10 text-base">Please log in to manage certificates securely.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <Input
              {...register('email')}
              type="email"
              label="Enter official unijos email"
              error={errors.email?.message}
              className="text-gray-900 placeholder:text-gray-400"
            />

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <Link
                  href="/reset-password"
                  className="text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  Forgot Password
                </Link>
              </div>
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                error={errors.password?.message}
                className="text-gray-900 placeholder:text-gray-400"
                rightElement={
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                }
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              isLoading={isLoading}
              loadingText="Signing in..."
              className="w-full"
              size="lg"
            >
              Next
            </Button>
          </form>

          {/* Support Link */}
          <div className="mt-10 text-center">
            <span className="text-gray-600">Need help? </span>
            <button className="text-orange-500 hover:text-orange-600 font-medium">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      
      {/* Toast Container */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}
