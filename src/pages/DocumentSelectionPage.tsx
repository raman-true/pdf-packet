import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { DocumentCard } from '../components/DocumentCard';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { fetchDocuments } from '../services/documentService';
import type { Document } from '../types';

interface DocumentSelectionPageProps {
  onBack: () => void;
  onNext: () => void;
}

export function DocumentSelectionPage({ onBack, onNext }: DocumentSelectionPageProps) {
  const {
    selectedDocuments,
    toggleDocument,
    isDocumentSelected,
    clearDocuments,
    getTotalSize,
  } = useDocumentStore();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      try {
        setLoading(true);
        const docs = await fetchDocuments();
        setDocuments(docs);
        setError(null);
      } catch (err) {
        setError('Failed to load documents. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-7xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Select Documents
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Choose which documents to include in your custom packet
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Available Documents
            </h2>
            {selectedDocuments.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearDocuments}>
                <XCircle className="w-4 h-4" />
                Clear All
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading documents...</p>
            </div>
          ) : error ? (
            <Card variant="elevated">
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            </Card>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {documents.map((document) => (
                <motion.div
                  key={document.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <DocumentCard
                    document={document}
                    isSelected={isDocumentSelected(document.id)}
                    onToggle={() => toggleDocument(document)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card variant="elevated" className="sticky top-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-600" />
              Selected Summary
            </h3>

            {selectedDocuments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No documents selected yet. Click on documents to add them to your packet.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Documents
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {selectedDocuments.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Total Size
                    </span>
                    <span className="text-lg font-bold text-primary-600">
                      {formatBytes(getTotalSize())}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                    Selected Documents:
                  </p>
                  {selectedDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="flex-1">{doc.name}</span>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={onNext}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Continue to Arrange
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </>
            )}
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          Back to Form
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={onNext}
          disabled={selectedDocuments.length === 0}
        >
          Continue to Arrange
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
}
