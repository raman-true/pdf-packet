import { InputHTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof MotionProps> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <motion.input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white dark:bg-slate-900
            border-2 border-slate-200 dark:border-slate-700
            focus:border-primary-500 dark:focus:border-primary-400
            focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10
            outline-none transition-all duration-200
            text-slate-900 dark:text-slate-100
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          whileFocus={{ scale: 1.01 }}
          {...props}
        />
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
