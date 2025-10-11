import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, checked, className = '', ...props }, ref) => {
    return (
      <label className={`inline-flex items-center gap-2.5 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            className="sr-only peer"
            {...props}
          />
          <motion.div
            className={`
              w-5 h-5 rounded-md border-2 transition-all duration-200
              flex items-center justify-center
              ${
                checked
                  ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600 group-hover:border-primary-400'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              initial={false}
              animate={{
                scale: checked ? 1 : 0,
                opacity: checked ? 1 : 0,
              }}
              transition={{ duration: 0.15 }}
            >
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>
        </div>
        {label && (
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
