import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center relative">
                <motion.div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-semibold
                    border-2 transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-primary-600 border-primary-600 text-white'
                        : isCurrent
                        ? 'bg-primary-100 dark:bg-primary-950 border-primary-600 text-primary-600'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400'
                    }
                  `}
                  whileHover={{ scale: 1.05 }}
                  initial={false}
                  animate={{
                    scale: isCurrent ? [1, 1.05, 1] : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                  }}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" strokeWidth={3} />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </motion.div>

                <div className="mt-3 text-center">
                  <p
                    className={`
                      text-sm font-semibold
                      ${isCurrent ? 'text-primary-600 dark:text-primary-400' : 'text-slate-600 dark:text-slate-400'}
                    `}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mb-12">
                  <motion.div
                    className="h-full bg-slate-200 dark:bg-slate-700 relative overflow-hidden rounded"
                    initial={false}
                  >
                    <motion.div
                      className="absolute inset-0 bg-primary-600"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: isCompleted ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
