import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubmittalForm } from '../types';

interface FormStore {
  formData: SubmittalForm;
  updateFormData: (data: Partial<SubmittalForm>) => void;
  resetFormData: () => void;
  isFormValid: () => boolean;
}

const initialFormData: SubmittalForm = {
  submittedTo: '',
  projectName: '',
  projectNumber: '',
  preparedBy: '',
  phoneEmail: '',
  date: new Date().toISOString().split('T')[0],
  status: {
    forReview: false,
    forRecord: false,
    forApproval: false,
    forInformationOnly: false,
  },
  submittalType: {
    esr: false,
    partSpecial: false,
    testReportICC: false,
    testReportIBC: false,
    testReportASTM: false,
    materialSafetyDataSheet: false,
    leedGuide: false,
    installationGuide: false,
    warranty: false,
    other: false,
  },
  productSize: '',
};

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      formData: initialFormData,

      updateFormData: (data) =>
        set((state) => ({
          formData: { ...state.formData, ...data },
        })),

      resetFormData: () =>
        set({
          formData: { ...initialFormData, date: new Date().toISOString().split('T')[0] },
        }),

      isFormValid: () => {
        const { formData } = get();
        return !!(
          formData.submittedTo.trim() &&
          formData.projectName.trim() &&
          formData.preparedBy.trim() &&
          formData.phoneEmail.trim() &&
          formData.productSize
        );
      },
    }),
    {
      name: 'maxterra-form-storage',
    }
  )
);
