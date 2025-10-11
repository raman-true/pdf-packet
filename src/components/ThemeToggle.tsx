import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '../store/useThemeStore';
import { useEffect } from 'react';

export function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-slate-200 dark:bg-slate-700 p-1 transition-colors duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-md flex items-center justify-center"
        initial={false}
        animate={{
          x: theme === 'dark' ? 28 : 0,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-slate-700" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </motion.div>
    </motion.button>
  );
}
