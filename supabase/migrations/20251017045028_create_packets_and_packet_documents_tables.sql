/*
  # Create Packets and Packet Documents Tables

  ## Description
  Creates the `packets` and `packet_documents` tables to track generated submittal packets
  and their associated documents.

  ## New Tables
  
  ### `packets`
  Stores information about generated submittal packets
  - `id` (uuid, primary key) - Unique packet identifier
  - `project_id` (uuid, foreign key) - Reference to the project
  - `file_name` (text) - Name of the generated PDF file
  - `file_size` (text, nullable) - Human-readable file size (e.g., "2.5 MB")
  - `page_count` (integer, nullable) - Total number of pages in the packet
  - `storage_path` (text, nullable) - Path where the PDF is stored
  - `download_url` (text, nullable) - URL to download the generated PDF
  - `status` (text) - Packet generation status: pending, generating, completed, failed
  - `error_message` (text, nullable) - Error message if generation failed
  - `created_at` (timestamptz) - When packet generation was initiated
  - `completed_at` (timestamptz, nullable) - When packet generation finished

  ### `packet_documents`
  Junction table linking packets to documents in specific order
  - `id` (uuid, primary key) - Unique record identifier
  - `packet_id` (uuid, foreign key) - Reference to the packet
  - `document_id` (uuid, foreign key) - Reference to the document
  - `document_order` (integer) - Order of document in the packet
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  - Enable RLS on both tables
  - Add policies for public access (no auth required)
*/

-- Create packets table
CREATE TABLE IF NOT EXISTS packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size text,
  page_count integer,
  storage_path text,
  download_url text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now() NOT NULL,
  completed_at timestamptz
);

-- Create packet_documents table
CREATE TABLE IF NOT EXISTS packet_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  packet_id uuid NOT NULL REFERENCES packets(id) ON DELETE CASCADE,
  document_id uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  document_order integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(packet_id, document_id)
);

-- Enable RLS
ALTER TABLE packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE packet_documents ENABLE ROW LEVEL SECURITY;

-- Packets policies
CREATE POLICY "Allow public read access to packets"
  ON packets FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to packets"
  ON packets FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to packets"
  ON packets FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to packets"
  ON packets FOR DELETE
  USING (true);

-- Packet documents policies
CREATE POLICY "Allow public read access to packet_documents"
  ON packet_documents FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to packet_documents"
  ON packet_documents FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access to packet_documents"
  ON packet_documents FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete access to packet_documents"
  ON packet_documents FOR DELETE
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS packets_project_id_idx ON packets(project_id);
CREATE INDEX IF NOT EXISTS packets_status_idx ON packets(status);
CREATE INDEX IF NOT EXISTS packets_created_at_idx ON packets(created_at DESC);
CREATE INDEX IF NOT EXISTS packet_documents_packet_id_idx ON packet_documents(packet_id);
CREATE INDEX IF NOT EXISTS packet_documents_document_id_idx ON packet_documents(document_id);
CREATE INDEX IF NOT EXISTS packet_documents_order_idx ON packet_documents(packet_id, document_order);
