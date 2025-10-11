import { SelectHTMLAttributes, forwardRef } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof MotionProps> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          <motion.select
            ref={ref}
            className={`
              w-full px-4 py-2.5 pr-10 rounded-lg appearance-none
              bg-white dark:bg-slate-900
              border-2 border-slate-200 dark:border-slate-700
              focus:border-primary-500 dark:focus:border-primary-400
              focus:ring-4 focus:ring-primary-500/10 dark:focus:ring-primary-400/10
              outline-none transition-all duration-200
              text-slate-900 dark:text-slate-100
              disabled:opacity-50 disabled:cursor-not-allowed
              cursor-pointer
              ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${className}
            `}
            whileFocus={{ scale: 1.01 }}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </motion.select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        </div>
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

Select.displayName = 'Select';
