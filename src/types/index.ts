export interface SubmittalForm {
  submittedTo: string;
  projectName: string;
  projectNumber: string;
  preparedBy: string;
  phoneEmail: string;
  date: string;
  status: {
    forReview: boolean;
    forRecord: boolean;
    forApproval: boolean;
    forInformationOnly: boolean;
  };
  submittalType: {
    esr: boolean;
    partSpecial: boolean;
    testReportICC: boolean;
    testReportIBC: boolean;
    testReportASTM: boolean;
    materialSafetyDataSheet: boolean;
    leedGuide: boolean;
    installationGuide: boolean;
    warranty: boolean;
    other: boolean;
  };
  productSize: string;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  fileSize: string;
  fileSizeBytes: number;
  url: string;
  category: DocumentCategory;
  thumbnail?: string;
  storagePath?: string;
}

export type DocumentCategory =
  | 'Technical Data Sheet'
  | 'Evaluation Report'
  | 'Safety Data Sheet'
  | 'LEED Guide'
  | 'Installation Guide'
  | 'Warranty'
  | 'Certification';

export interface SelectedDocument extends Document {
  order: number;
}

export interface PacketConfig {
  formData: SubmittalForm;
  documents: SelectedDocument[];
}

export interface PacketGenerationResponse {
  success: boolean;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
  pageCount?: number;
  error?: string;
}

export interface PacketGenerationStatus {
  isGenerating: boolean;
  progress: number;
  error: string | null;
  result: PacketGenerationResponse | null;
}

export type ThemeMode = 'light' | 'dark';

export interface AppStep {
  id: number;
  name: string;
  description: string;
  path: string;
}
