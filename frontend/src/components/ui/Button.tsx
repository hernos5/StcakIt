import React from 'react';
import { motion } from 'framer-motion';
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  icon?: React.ReactNode;
}
export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  type = 'button',
  disabled = false,
  icon
}: ButtonProps) => {
  const baseStyles = 'rounded-full font-medium transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-dark';
  const variantStyles = {
    primary: 'bg-primary hover:shadow-glow text-white focus:ring-primary',
    secondary: 'bg-secondary hover:shadow-glow-secondary text-white focus:ring-secondary',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10 focus:ring-primary',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
  };
  const sizeStyles = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  return <motion.button whileHover={!disabled ? {
    scale: 1.03
  } : {}} whileTap={!disabled ? {
    scale: 0.97
  } : {}} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`} onClick={onClick} type={type} disabled={disabled}>
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </motion.button>;
};