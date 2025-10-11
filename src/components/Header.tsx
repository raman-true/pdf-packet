import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 glass-strong shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                MAXTERRA® Packet Builder
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                NEXGEN Building Products
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
}
