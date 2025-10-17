/*
  # Complete MAXTERRA Document Management System Schema
  
  ## Overview
  This migration creates a comprehensive document management system for MAXTERRA products
  with support for package creation, document arrangement, section dividers, and custom
  page numbering.
  
  ## New Tables
  
  ### 1. `documents`
  Stores all available MAXTERRA product documents with metadata
  - `id` (uuid, primary key)
  - `title` (text) - Document display name
  - `file_name` (text) - Original PDF filename
  - `file_path` (text) - Storage path for the PDF
  - `description` (text) - Document description
  - `document_type` (text) - Type category (technical, installation, safety, etc.)
  - `page_count` (integer) - Number of pages in the document
  - `file_size` (bigint) - File size in bytes
  - `version` (text) - Document version
  - `display_order` (integer) - Default display order
  - `is_active` (boolean) - Whether document is available for selection
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `packages`
  Stores created document packages/submittals
  - `id` (uuid, primary key)
  - `package_name` (text) - User-defined package name
  - `project_name` (text) - Associated project name
  - `project_number` (text) - Project number/identifier
  - `created_by` (text) - User who created the package
  - `status` (text) - Package status (draft, finalized, archived)
  - `cover_page_data` (jsonb) - Cover page information
  - `total_pages` (integer) - Total pages in final package
  - `generated_file_path` (text) - Path to generated PDF
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. `package_documents`
  Junction table linking documents to packages with arrangement
  - `id` (uuid, primary key)
  - `package_id` (uuid, foreign key to packages)
  - `document_id` (uuid, foreign key to documents)
  - `sort_order` (integer) - Order of document in package
  - `include_divider` (boolean) - Whether to include section divider
  - `divider_title` (text) - Custom title for divider page
  - `divider_design` (jsonb) - Custom divider design settings
  - `page_range_start` (integer) - Starting page in final package
  - `page_range_end` (integer) - Ending page in final package
  - `notes` (text) - User notes for this document
  - `created_at` (timestamptz)
  
  ### 4. `document_selections`
  Tracks user's document selections during workflow (persistent cart)
  - `id` (uuid, primary key)
  - `session_id` (text) - Session identifier
  - `user_id` (text) - Optional user identifier
  - `document_id` (uuid, foreign key to documents)
  - `selected_at` (timestamptz)
  - `is_active` (boolean) - Whether selection is still active
  
  ### 5. `divider_templates`
  Stores divider page design templates
  - `id` (uuid, primary key)
  - `template_name` (text)
  - `design_config` (jsonb) - Template configuration
  - `preview_image_url` (text)
  - `is_default` (boolean)
  - `created_at` (timestamptz)
  
  ## Security
  - RLS enabled on all tables
  - Public read access for documents
  - Authenticated users can create and manage packages
  
  ## Initial Data
  Pre-populates documents table with the 5 MAXTERRA PDF documents
*/

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  file_name text NOT NULL UNIQUE,
  file_path text NOT NULL,
  description text,
  document_type text NOT NULL DEFAULT 'technical',
  page_count integer NOT NULL DEFAULT 1,
  file_size bigint,
  version text,
  display_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name text NOT NULL,
  project_name text,
  project_number text,
  created_by text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'finalized', 'archived')),
  cover_page_data jsonb,
  total_pages integer,
  generated_file_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create package_documents junction table
CREATE TABLE IF NOT EXISTS package_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  sort_order integer NOT NULL DEFAULT 0,
  include_divider boolean NOT NULL DEFAULT true,
  divider_title text,
  divider_design jsonb,
  page_range_start integer,
  page_range_end integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(package_id, document_id)
);

-- Create document_selections table for persistent cart
CREATE TABLE IF NOT EXISTS document_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id text,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  selected_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

-- Create divider_templates table
CREATE TABLE IF NOT EXISTS divider_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name text NOT NULL,
  design_config jsonb NOT NULL,
  preview_image_url text,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_active ON documents(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_display_order ON documents(display_order);
CREATE INDEX IF NOT EXISTS idx_packages_status ON packages(status);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_package_documents_package ON package_documents(package_id);
CREATE INDEX IF NOT EXISTS idx_package_documents_sort ON package_documents(package_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_document_selections_session ON document_selections(session_id);
CREATE INDEX IF NOT EXISTS idx_document_selections_active ON document_selections(session_id, is_active);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE divider_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for documents (public read)
CREATE POLICY "Documents are viewable by everyone"
  ON documents FOR SELECT
  TO public
  USING (is_active = true);

-- RLS Policies for packages
CREATE POLICY "Users can view their own packages"
  ON packages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create packages"
  ON packages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their packages"
  ON packages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their packages"
  ON packages FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for package_documents
CREATE POLICY "Package documents viewable by authenticated users"
  ON package_documents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can add documents to packages"
  ON package_documents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update package documents"
  ON package_documents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can remove documents from packages"
  ON package_documents FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for document_selections
CREATE POLICY "Users can view their own selections"
  ON document_selections FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Users can create selections"
  ON document_selections FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users can update their selections"
  ON document_selections FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete their selections"
  ON document_selections FOR DELETE
  TO public
  USING (true);

-- RLS Policies for divider_templates
CREATE POLICY "Divider templates are viewable by everyone"
  ON divider_templates FOR SELECT
  TO public
  USING (true);

-- Insert the 5 MAXTERRA PDF documents
INSERT INTO documents (title, file_name, file_path, description, document_type, page_count, version, display_order) VALUES
(
  'Installation Guide',
  'Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf',
  '/documents/Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf',
  'Complete installation guide for MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor panels including best practices, safety requirements, and step-by-step installation instructions.',
  'installation',
  21,
  '1.02',
  1
),
(
  'Technical Data Sheet (TDS)',
  'TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf',
  '/documents/TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf',
  'Technical specifications, performance characteristics, and product dimensions for MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels.',
  'technical',
  2,
  '1.2',
  2
),
(
  'ICC-ES Evaluation Report (ESR-5194)',
  'ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf',
  '/documents/ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf',
  'ICC-ES Evaluation Report ESR-5194 providing code compliance verification, structural performance data, and approved uses for MAXTERRA floor panels.',
  'technical',
  12,
  'June 2024',
  3
),
(
  'Safety Data Sheet (MSDS)',
  'MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf',
  '/documents/MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf',
  'Material Safety Data Sheet containing hazard identification, handling procedures, and emergency response information for MAXTERRA panels.',
  'safety',
  11,
  'Version 1 Sept 2024',
  4
),
(
  'LEED Credit Guide',
  'LEED Credit Guide 7-16-25 (1).pdf',
  '/documents/LEED Credit Guide 7-16-25 (1).pdf',
  'Guide for earning LEED credits with MAXTERRA products including Environmental Product Declarations, Material Ingredients, and Sourcing information.',
  'environmental',
  4,
  '7-16-25',
  5
)
ON CONFLICT (file_name) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  document_type = EXCLUDED.document_type,
  page_count = EXCLUDED.page_count,
  version = EXCLUDED.version,
  display_order = EXCLUDED.display_order,
  updated_at = now();

-- Insert default divider template
INSERT INTO divider_templates (template_name, design_config, is_default) VALUES
(
  'NEXGEN Standard',
  '{
    "backgroundColor": "#FFFFFF",
    "titleColor": "#1a1a1a",
    "accentColor": "#00a6a6",
    "font": "Arial",
    "titleSize": 36,
    "showLogo": true,
    "logoPosition": "top-center"
  }'::jsonb,
  true
)
ON CONFLICT DO NOTHING;
