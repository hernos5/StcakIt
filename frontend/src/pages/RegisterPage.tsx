import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserIcon, MailIcon, LockIcon, GithubIcon } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
// Define validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({
      message: 'You must accept the terms and conditions'
    })
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});
type RegisterFormData = z.infer<typeof registerSchema>;
export const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register: registerUser
  } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false
    }
  });
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create account');
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
          <p className="text-text-muted mt-2">Create your account</p>
        </div>
        <div className="glass-card p-6 backdrop-blur-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <div className="relative">
                <input id="name" type="text" {...register('name')} className={`w-full bg-background-dark bg-opacity-50 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="John Doe" />
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <input id="email" type="email" {...register('email')} className={`w-full bg-background-dark bg-opacity-50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="you@example.com" />
                <MailIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
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
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input id="confirmPassword" type="password" {...register('confirmPassword')} className={`w-full bg-background-dark bg-opacity-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary`} placeholder="••••••••" />
                <LockIcon className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>}
            </div>
            <div className="flex items-center">
              <input id="terms" type="checkbox" {...register('terms')} className={`h-4 w-4 rounded border-white/10 bg-background-dark ${errors.terms ? 'border-red-500' : ''}`} />
              <label htmlFor="terms" className="ml-2 block text-sm">
                I agree to the{' '}
                <a href="#" className="text-primary hover:text-primary/80">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:text-primary/80">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && <p className="mt-1 text-sm text-red-500">
                {errors.terms.message}
              </p>}
            <motion.button type="submit" disabled={isLoading} className="w-full bg-primary hover:shadow-glow text-white rounded-lg py-2 font-medium transition-all duration-300" whileHover={{
            scale: 1.02
          }} whileTap={{
            scale: 0.98
          }}>
              {isLoading ? 'Creating account...' : 'Create account'}
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
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>;
};