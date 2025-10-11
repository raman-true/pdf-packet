import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ArrowLeft, GripVertical, Trash2, ArrowUp, ArrowDown, Package } from 'lucide-react';
import { useDocumentStore } from '../store/useDocumentStore';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useState } from 'react';

interface ArrangeDocumentsPageProps {
  onBack: () => void;
  onGenerate: () => void;
}

export function ArrangeDocumentsPage({ onBack, onGenerate }: ArrangeDocumentsPageProps) {
  const { selectedDocuments, reorderDocuments, removeDocument } = useDocumentStore();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    reorderDocuments(result.source.index, result.destination.index);
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      reorderDocuments(index, index - 1);
    }
  };

  const moveDown = (index: number) => {
    if (index < selectedDocuments.length - 1) {
      reorderDocuments(index, index + 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    onGenerate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          Arrange Documents
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          Drag and drop to reorder documents in your packet
        </p>
      </div>

      <Card variant="elevated" className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Package className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Your Packet Order
          </h2>
          <span className="ml-auto text-sm font-medium text-slate-600 dark:text-slate-400">
            {selectedDocuments.length} {selectedDocuments.length === 1 ? 'document' : 'documents'}
          </span>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="documents">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 min-h-[200px] p-4 rounded-lg transition-colors ${
                  snapshot.isDraggingOver
                    ? 'bg-primary-50 dark:bg-primary-950/20 border-2 border-dashed border-primary-400'
                    : 'bg-slate-50 dark:bg-slate-800/50'
                }`}
              >
                {selectedDocuments.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    No documents selected. Go back to select documents.
                  </div>
                ) : (
                  selectedDocuments.map((document, index) => (
                    <Draggable key={document.id} draggableId={document.id} index={index}>
                      {(provided, snapshot) => (
                        <motion.div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`
                            bg-white dark:bg-slate-900 rounded-lg p-4 shadow-md
                            border-2 transition-all
                            ${
                              snapshot.isDragging
                                ? 'border-primary-600 shadow-xl scale-105 rotate-2'
                                : 'border-slate-200 dark:border-slate-700'
                            }
                          `}
                        >
                          <div className="flex items-center gap-4">
                            <div
                              {...provided.dragHandleProps}
                              className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400 hover:text-primary-600 transition-colors"
                            >
                              <GripVertical className="w-6 h-6" />
                            </div>

                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                              {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                                {document.name}
                              </h3>
                              <div className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {document.fileSize}
                                </span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                                  {document.category}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => moveUp(index)}
                                disabled={index === 0}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <ArrowUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              </button>
                              <button
                                onClick={() => moveDown(index)}
                                disabled={index === selectedDocuments.length - 1}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <ArrowDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                              </button>
                              <button
                                onClick={() => removeDocument(document.id)}
                                className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                                title="Remove"
                              >
                                <Trash2 className="w-5 h-5 text-red-500" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
          Back to Selection
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={selectedDocuments.length === 0 || isGenerating}
          loading={isGenerating}
        >
          <Package className="w-5 h-5" />
          Create Packet
        </Button>
      </div>
    </motion.div>
  );
}
