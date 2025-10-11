import { HTMLAttributes, forwardRef, ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, keyof MotionProps> {
  variant?: 'default' | 'glass' | 'elevated';
  hoverable?: boolean;
  children?: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hoverable = false, className = '', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700',
      glass: 'glass shadow-glass',
      elevated: 'bg-white dark:bg-slate-900 shadow-lg border border-slate-100 dark:border-slate-800',
    };

    return (
      <motion.div
        ref={ref}
        className={`rounded-xl p-6 ${variants[variant]} ${className}`}
        whileHover={hoverable ? { y: -2, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' } : {}}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
