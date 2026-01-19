import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import React from 'react';

const ThemeToggle: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300 hover:scale-110"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <motion.div
                initial={false}
                animate={{
                    scale: [0.8, 1.2, 1],
                    rotate: theme === 'dark' ? 180 : 0,
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
                {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-slate-700" />
                ) : (
                    <Sun className="w-5 h-5 text-[#d4af37]" />
                )}
            </motion.div>
        </button>
    );
};

export default ThemeToggle;
