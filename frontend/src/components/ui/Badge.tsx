import React, { Component } from 'react';
import { motion } from 'framer-motion';
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'default' | 'success' | 'danger';
  className?: string;
  onClick?: () => void;
}
export const Badge = ({
  children,
  variant = 'default',
  className = '',
  onClick
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-all duration-200';
  const variantStyles = {
    primary: 'bg-primary/20 text-primary',
    secondary: 'bg-secondary/20 text-secondary',
    default: 'bg-text-muted/20 text-text-muted',
    success: 'bg-green-500/20 text-green-500',
    danger: 'bg-red-500/20 text-red-500'
  };
  const Component = onClick ? motion.button : motion.span;
  return <Component whileHover={onClick ? {
    scale: 1.05
  } : {}} whileTap={onClick ? {
    scale: 0.95
  } : {}} onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {children}
    </Component>;
};