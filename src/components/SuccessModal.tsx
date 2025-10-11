import { motion } from 'framer-motion';
import { CheckCircle2, Download, FileText, RotateCcw, ExternalLink } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { PacketGenerationResponse } from '../types';

interface SuccessModalProps {
  isOpen: boolean;
  result: PacketGenerationResponse | null;
  onClose: () => void;
  onCreateAnother: () => void;
}

export function SuccessModal({ isOpen, result, onClose, onCreateAnother }: SuccessModalProps) {
  if (!result || !result.success) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" showCloseButton={false}>
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="mb-6 inline-block"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-accent-500/30">
            <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            Packet Created Successfully!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-8">
            Your custom MAXTERRA® packet has been generated and is ready to download.
          </p>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4 justify-center mb-4">
              <FileText className="w-8 h-8 text-primary-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  File Name
                </p>
                <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {result.fileName || 'MAXTERRA_Packet.pdf'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              {result.fileSize && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">File Size</p>
                  <p className="text-lg font-bold text-primary-600">{result.fileSize}</p>
                </div>
              )}
              {result.pageCount && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Pages</p>
                  <p className="text-lg font-bold text-primary-600">{result.pageCount}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {result.downloadUrl && (
              <>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => window.open(result.downloadUrl, '_blank')}
                >
                  <Download className="w-5 h-5" />
                  Download Packet
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={() => window.open(result.downloadUrl, '_blank')}
                >
                  <ExternalLink className="w-5 h-5" />
                  View in Browser
                </Button>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Button variant="ghost" onClick={onCreateAnother}>
              <RotateCcw className="w-5 h-5" />
              Create Another Packet
            </Button>
          </div>
        </motion.div>
      </div>
    </Modal>
  );
}
