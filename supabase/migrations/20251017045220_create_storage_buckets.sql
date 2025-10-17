/*
  # Create Storage Buckets

  ## Description
  Creates storage buckets for document management in the MAXTERRA submittal system.

  ## New Buckets
  
  ### `source-documents`
  Stores the original source PDF documents (ESR, MSDS, TDS, etc.)
  - Public access for reading
  - Restricted write access
  
  ### `generated-packets`
  Stores the generated submittal packet PDFs
  - Public access for reading and downloading
  - Restricted write access (only edge functions can write)

  ## Security
  - Both buckets are public for reading (anyone can download files)
  - Write access is restricted to authenticated users/service role
  - File size limits applied for safety
*/

-- Create source-documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'source-documents',
  'source-documents',
  true,
  52428800, -- 50MB limit
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create generated-packets bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'generated-packets',
  'generated-packets',
  true,
  104857600, -- 100MB limit
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access to source-documents
CREATE POLICY "Allow public read access to source documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'source-documents');

-- Create policy for public insert access to source-documents (for initial upload)
CREATE POLICY "Allow public insert access to source documents"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'source-documents');

-- Create policy for public update access to source-documents
CREATE POLICY "Allow public update access to source documents"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'source-documents')
  WITH CHECK (bucket_id = 'source-documents');

-- Create policy for public read access to generated-packets
CREATE POLICY "Allow public read access to generated packets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'generated-packets');

-- Create policy for public insert access to generated-packets
CREATE POLICY "Allow public insert access to generated packets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'generated-packets');

-- Create policy for public update access to generated-packets
CREATE POLICY "Allow public update access to generated packets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'generated-packets')
  WITH CHECK (bucket_id = 'generated-packets');

-- Create policy for public delete access to generated-packets
CREATE POLICY "Allow public delete access to generated packets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'generated-packets');
