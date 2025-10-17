export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          submitted_to: string;
          project_name: string;
          project_number: string | null;
          prepared_by: string;
          phone_email: string;
          date: string;
          status: {
            forReview: boolean;
            forRecord: boolean;
            forApproval: boolean;
            forInformationOnly: boolean;
          };
          submittal_type: {
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
          product_size: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          submitted_to: string;
          project_name: string;
          project_number?: string | null;
          prepared_by: string;
          phone_email: string;
          date: string;
          status: {
            forReview: boolean;
            forRecord: boolean;
            forApproval: boolean;
            forInformationOnly: boolean;
          };
          submittal_type: {
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
          product_size: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          submitted_to?: string;
          project_name?: string;
          project_number?: string | null;
          prepared_by?: string;
          phone_email?: string;
          date?: string;
          status?: {
            forReview: boolean;
            forRecord: boolean;
            forApproval: boolean;
            forInformationOnly: boolean;
          };
          submittal_type?: {
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
          product_size?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          file_name: string;
          file_path: string;
          name: string;
          description: string | null;
          document_type: string;
          page_count: number;
          file_size: number | null;
          file_size_text: string | null;
          storage_path: string;
          category: string | null;
          version: string | null;
          thumbnail_url: string | null;
          is_active: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          file_name: string;
          file_path: string;
          name?: string;
          description?: string | null;
          document_type?: string;
          page_count?: number;
          file_size?: number | null;
          file_size_text?: string | null;
          storage_path?: string;
          category?: string | null;
          version?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          file_name?: string;
          file_path?: string;
          name?: string;
          description?: string | null;
          document_type?: string;
          page_count?: number;
          file_size?: number | null;
          file_size_text?: string | null;
          storage_path?: string;
          category?: string | null;
          version?: string | null;
          thumbnail_url?: string | null;
          is_active?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      packets: {
        Row: {
          id: string;
          project_id: string;
          file_name: string;
          file_size: string | null;
          page_count: number | null;
          storage_path: string | null;
          download_url: string | null;
          status: 'pending' | 'generating' | 'completed' | 'failed';
          error_message: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          project_id: string;
          file_name: string;
          file_size?: string | null;
          page_count?: number | null;
          storage_path?: string | null;
          download_url?: string | null;
          status?: 'pending' | 'generating' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          project_id?: string;
          file_name?: string;
          file_size?: string | null;
          page_count?: number | null;
          storage_path?: string | null;
          download_url?: string | null;
          status?: 'pending' | 'generating' | 'completed' | 'failed';
          error_message?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
      };
      packet_documents: {
        Row: {
          id: string;
          packet_id: string;
          document_id: string;
          document_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          packet_id: string;
          document_id: string;
          document_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          packet_id?: string;
          document_id?: string;
          document_order?: number;
          created_at?: string;
        };
      };
    };
  };
}
