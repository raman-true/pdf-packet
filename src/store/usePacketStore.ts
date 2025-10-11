import { create } from 'zustand';
import { PacketGenerationStatus, PacketGenerationResponse } from '../types';

interface PacketStore extends PacketGenerationStatus {
  startGeneration: () => void;
  updateProgress: (progress: number) => void;
  setSuccess: (response: PacketGenerationResponse) => void;
  setError: (error: string) => void;
  reset: () => void;
}

const initialState: PacketGenerationStatus = {
  isGenerating: false,
  progress: 0,
  error: null,
  result: null,
};

export const usePacketStore = create<PacketStore>((set) => ({
  ...initialState,

  startGeneration: () =>
    set({
      isGenerating: true,
      progress: 0,
      error: null,
      result: null,
    }),

  updateProgress: (progress) => set({ progress }),

  setSuccess: (response) =>
    set({
      isGenerating: false,
      progress: 100,
      error: null,
      result: response,
    }),

  setError: (error) =>
    set({
      isGenerating: false,
      error,
      result: null,
    }),

  reset: () => set(initialState),
}));
