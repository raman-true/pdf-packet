import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document, SelectedDocument } from '../types';

interface DocumentStore {
  selectedDocuments: SelectedDocument[];
  addDocument: (document: Document) => void;
  removeDocument: (documentId: string) => void;
  toggleDocument: (document: Document) => void;
  reorderDocuments: (startIndex: number, endIndex: number) => void;
  clearDocuments: () => void;
  isDocumentSelected: (documentId: string) => boolean;
  getTotalSize: () => number;
}

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      selectedDocuments: [],

      addDocument: (document) =>
        set((state) => {
          if (state.selectedDocuments.some((doc) => doc.id === document.id)) {
            return state;
          }
          const order = state.selectedDocuments.length;
          return {
            selectedDocuments: [...state.selectedDocuments, { ...document, order }],
          };
        }),

      removeDocument: (documentId) =>
        set((state) => {
          const filtered = state.selectedDocuments.filter((doc) => doc.id !== documentId);
          return {
            selectedDocuments: filtered.map((doc, index) => ({ ...doc, order: index })),
          };
        }),

      toggleDocument: (document) => {
        const { isDocumentSelected, addDocument, removeDocument } = get();
        if (isDocumentSelected(document.id)) {
          removeDocument(document.id);
        } else {
          addDocument(document);
        }
      },

      reorderDocuments: (startIndex, endIndex) =>
        set((state) => {
          const result = Array.from(state.selectedDocuments);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            selectedDocuments: result.map((doc, index) => ({ ...doc, order: index })),
          };
        }),

      clearDocuments: () => set({ selectedDocuments: [] }),

      isDocumentSelected: (documentId) =>
        get().selectedDocuments.some((doc) => doc.id === documentId),

      getTotalSize: () =>
        get().selectedDocuments.reduce((total, doc) => total + doc.fileSizeBytes, 0),
    }),
    {
      name: 'maxterra-documents-storage',
    }
  )
);
