import { motion } from 'framer-motion';
import { FileText, Check } from 'lucide-react';
import { Document } from '../types';

interface DocumentCardProps {
  document: Document;
  isSelected: boolean;
  onToggle: () => void;
}

export function DocumentCard({ document, isSelected, onToggle }: DocumentCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`
        relative cursor-pointer rounded-xl p-5 border-2 transition-all duration-200
        ${
          isSelected
            ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 shadow-lg shadow-primary-500/20'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md'
        }
      `}
    >
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-5 h-5 text-white" strokeWidth={3} />
        </motion.div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`
          flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
          ${
            isSelected
              ? 'bg-primary-600 text-white'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }
        `}
        >
          <FileText className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={`
            font-semibold text-sm leading-tight mb-1
            ${isSelected ? 'text-primary-900 dark:text-primary-100' : 'text-slate-900 dark:text-slate-100'}
          `}
          >
            {document.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mb-2 line-clamp-2">
            {document.description}
          </p>
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-500">
              {document.fileSize}
            </span>
            <span
              className={`
              text-xs px-2 py-0.5 rounded-full
              ${
                isSelected
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }
            `}
            >
              {document.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
