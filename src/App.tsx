import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { SubmittalFormPage } from './pages/SubmittalFormPage';
import { DocumentSelectionPage } from './pages/DocumentSelectionPage';
import { ArrangeDocumentsPage } from './pages/ArrangeDocumentsPage';
import { SuccessModal } from './components/SuccessModal';
import { APP_STEPS } from './constants/documents';
import { useFormStore } from './store/useFormStore';
import { useDocumentStore } from './store/useDocumentStore';
import { usePacketStore } from './store/usePacketStore';
import { generatePacket } from './utils/api';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { formData } = useFormStore();
  const { selectedDocuments } = useDocumentStore();
  const { result, startGeneration, setSuccess, setError } = usePacketStore();

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = async () => {
    startGeneration();

    try {
      const packetConfig = {
        formData,
        documents: selectedDocuments,
      };

      const response = await generatePacket(packetConfig);
      setSuccess(response);
      setShowSuccessModal(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to generate packet');
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12">
          <StepIndicator steps={APP_STEPS} currentStep={currentStep} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <SubmittalFormPage onNext={handleNext} />}
            {currentStep === 2 && (
              <DocumentSelectionPage onBack={handleBack} onNext={handleNext} />
            )}
            {currentStep === 3 && (
              <ArrangeDocumentsPage onBack={handleBack} onGenerate={handleGenerate} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <SuccessModal
        isOpen={showSuccessModal}
        result={result}
        onClose={() => setShowSuccessModal(false)}
        onCreateAnother={handleCreateAnother}
      />

      <footer className="mt-16 pb-8 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2025 NEXGEN Building Products, LLC</p>
        <p className="mt-1">MAXTERRA® PDF Packet Builder</p>
      </footer>
    </div>
  );
}

export default App;
