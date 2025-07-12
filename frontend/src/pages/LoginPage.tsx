import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserIcon, LockIcon, GithubIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Define validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});
type LoginFormData = z.infer<typeof loginSchema>;
export const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    login
  } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background-dark flex items-center justify-center p-4">
      <motion.div initial={{
      opacity: 0,
      y: 20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-primary font-bold text-3xl hover-glow inline-block">
            <span className="text-white">Stack</span>
            <span className="text-primary">It</span>
          </Link>
          <p className="text-text-muted mt-2">Sign in to your account</p>
        </div>
        <div className="glass-card p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <input id="email" type="email" {...register('email')} className={`w-full bg-background-dark bg-opacity-50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="you@example.com" />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <input id="password" type="password" {...register('password')} className={`w-full bg-background-dark bg-opacity-50 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="••••••••" />
                <LockIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" {...register('rememberMe')} className="h-4 w-4 rounded border-white/10 bg-background-dark" />
                <label htmlFor="remember-me" className="ml-2 block text-sm">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:text-primary/80">
                Forgot password?
              </a>
            </div>
            <motion.button type="submit" disabled={isLoading} className="w-full bg-primary hover:shadow-glow text-white rounded-lg py-2 font-medium transition-all duration-300" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background-medium text-text-muted">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-background-dark">
                <GithubIcon className="h-5 w-5 mr-2" />
                <span className="text-sm">GitHub</span>
              </motion.button>
              <motion.button whileHover={{
              scale: 1.05
            }} whileTap={{
              scale: 0.95
            }} className="flex justify-center items-center py-2 px-4 border border-white/10 rounded-lg hover:bg-background-dark">
                <div className="h-5 w-5 mr-2" />
                <span className="text-sm">Google</span>
              </motion.button>
            </div>
          </div>
        </div>
        <p className="text-center mt-6 text-sm text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>;
};