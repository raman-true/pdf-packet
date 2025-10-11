/*
  # MAXTERRA PDF Packet Builder Database Schema

  ## Overview
  This migration creates the complete database schema for the MAXTERRA PDF Packet Builder application,
  enabling users to create, manage, and download custom PDF submittal packets.

  ## New Tables

  ### 1. `projects`
  Stores submittal form data entered by users in Step 1.
  - `id` (uuid, primary key) - Unique project identifier
  - `submitted_to` (text) - Company or person receiving the submittal
  - `project_name` (text) - Name of the construction project
  - `project_number` (text, nullable) - Optional project tracking number
  - `prepared_by` (text) - Name of person preparing the submittal
  - `phone_email` (text) - Contact information for preparer
  - `date` (date) - Submittal date
  - `status` (jsonb) - Status checkboxes (forReview, forRecord, forApproval, forInformationOnly)
  - `submittal_type` (jsonb) - Submittal type checkboxes (esr, partSpecial, testReports, etc.)
  - `product_size` (text) - Selected MAXTERRA product size
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 2. `documents`
  Stores metadata for available PDF documents that can be included in packets.
  - `id` (uuid, primary key) - Unique document identifier
  - `name` (text) - Display name of the document
  - `description` (text) - Detailed description of document contents
  - `file_size` (text) - Human-readable file size (e.g., "2 MB")
  - `file_size_bytes` (bigint) - Exact file size in bytes for calculations
  - `storage_path` (text) - Path to PDF file in Supabase Storage
  - `category` (text) - Document category for filtering and organization
  - `thumbnail_url` (text, nullable) - Optional thumbnail image URL
  - `is_active` (boolean) - Whether document is available for selection
  - `display_order` (integer) - Default sort order in document list
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record last update timestamp

  ### 3. `packets`
  Tracks generated PDF packets with status and metadata.
  - `id` (uuid, primary key) - Unique packet identifier
  - `project_id` (uuid, foreign key) - Reference to associated project
  - `file_name` (text) - Generated PDF file name
  - `file_size` (text) - Human-readable final packet size
  - `page_count` (integer) - Total number of pages in generated PDF
  - `storage_path` (text, nullable) - Path to generated PDF in Supabase Storage
  - `download_url` (text, nullable) - Public or signed URL for downloading
  - `status` (text) - Generation status: 'pending', 'generating', 'completed', 'failed'
  - `error_message` (text, nullable) - Error details if generation failed
  - `created_at` (timestamptz) - Packet creation timestamp
  - `completed_at` (timestamptz, nullable) - Timestamp when generation completed

  ### 4. `packet_documents`
  Junction table linking packets with their selected documents in order.
  - `id` (uuid, primary key) - Unique junction record identifier
  - `packet_id` (uuid, foreign key) - Reference to packet
  - `document_id` (uuid, foreign key) - Reference to document
  - `document_order` (integer) - Position of document in the packet (1-based)
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security

  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:
  - Public read access for documents table (available documents catalog)
  - No authentication required initially (can be added later if needed)
  - Future: Add user authentication and restrict projects/packets to owners

  ## Indexes
  Performance indexes added for:
  - Document category and active status filtering
  - Packet status and project lookups
  - Packet document ordering queries

  ## Important Notes
  1. All timestamps use timestamptz for proper timezone handling
  2. JSONB columns store complex form data efficiently
  3. Foreign keys ensure referential integrity
  4. Default values prevent null-related issues
  5. Cascading deletes maintain data consistency
*/

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  submitted_to text NOT NULL,
  project_name text NOT NULL,
  project_number text,
  prepared_by text NOT NULL,
  phone_email text NOT NULL,
  date date NOT NULL,
  status jsonb NOT NULL DEFAULT '{
    "forReview": false,
    "forRecord": false,
    "forApproval": false,
    "forInformationOnly": false
  }'::jsonb,
  submittal_type jsonb NOT NULL DEFAULT '{
    "esr": false,
    "partSpecial": false,
    "testReportICC": false,
    "testReportIBC": false,
    "testReportASTM": false,
    "materialSafetyDataSheet": false,
    "leedGuide": false,
    "installationGuide": false,
    "warranty": false,
    "other": false
  }'::jsonb,
  product_size text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  file_size text NOT NULL,
  file_size_bytes bigint NOT NULL,
  storage_path text NOT NULL,
  category text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create packets table
CREATE TABLE IF NOT EXISTS packets (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size text,
  page_count integer,
  storage_path text,
  download_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create packet_documents junction table
CREATE TABLE IF NOT EXISTS packet_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  packet_id uuid NOT NULL REFERENCES packets(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_order integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(packet_id, document_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_active ON documents(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_display_order ON documents(display_order);
CREATE INDEX IF NOT EXISTS idx_packets_project_id ON packets(project_id);
CREATE INDEX IF NOT EXISTS idx_packets_status ON packets(status);
CREATE INDEX IF NOT EXISTS idx_packets_created_at ON packets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_packet_documents_packet_id ON packet_documents(packet_id);
CREATE INDEX IF NOT EXISTS idx_packet_documents_order ON packet_documents(packet_id, document_order);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE packet_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents (public read access)
CREATE POLICY "Anyone can view active documents"
  ON documents FOR SELECT
  USING (is_active = true);

-- RLS Policies for projects (public access for now, can be restricted later)
CREATE POLICY "Anyone can insert projects"
  ON projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update projects"
  ON projects FOR UPDATE
  USING (true);

-- RLS Policies for packets (public access for now)
CREATE POLICY "Anyone can insert packets"
  ON packets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view packets"
  ON packets FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update packets"
  ON packets FOR UPDATE
  USING (true);

-- RLS Policies for packet_documents (public access for now)
CREATE POLICY "Anyone can insert packet documents"
  ON packet_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view packet documents"
  ON packet_documents FOR SELECT
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
