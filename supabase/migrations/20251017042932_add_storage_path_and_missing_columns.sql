/*
  # Fix Documents Table Schema

  ## Changes
  1. Add `storage_path` column for document paths
  2. Add `name` column for display names (mapped from title)
  3. Add `file_size_text` column for human-readable file sizes
  4. Rename/use `file_size` as bytes (already exists as bigint)
  5. Add `category` column mapped from document_type
  6. Add `thumbnail_url` column for document previews
  7. Populate these columns with appropriate data

  ## Migration Strategy
  - Add new columns without dropping existing ones
  - Populate columns from existing data
  - Use file_path as storage_path (serving from public folder)
*/

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'name'
  ) THEN
    ALTER TABLE documents ADD COLUMN name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'storage_path'
  ) THEN
    ALTER TABLE documents ADD COLUMN storage_path text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'file_size_text'
  ) THEN
    ALTER TABLE documents ADD COLUMN file_size_text text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'category'
  ) THEN
    ALTER TABLE documents ADD COLUMN category text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'documents' AND column_name = 'thumbnail_url'
  ) THEN
    ALTER TABLE documents ADD COLUMN thumbnail_url text;
  END IF;
END $$;

-- Populate name from title
UPDATE documents SET name = title WHERE name IS NULL;

-- Populate storage_path from file_path (will be used for static asset serving)
UPDATE documents SET storage_path = file_path WHERE storage_path IS NULL;

-- Populate category from document_type
UPDATE documents 
SET category = CASE document_type
  WHEN 'technical' THEN 'Technical Data Sheet'
  WHEN 'installation' THEN 'Installation Guide'
  WHEN 'safety' THEN 'Safety Data Sheet'
  WHEN 'environmental' THEN 'LEED Guide'
  ELSE 'Technical Data Sheet'
END
WHERE category IS NULL;

-- Add file sizes (bytes and human-readable text)
UPDATE documents
SET 
  file_size = CASE file_name
    WHEN 'Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf' THEN 2500000
    WHEN 'TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf' THEN 150000
    WHEN 'ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf' THEN 1800000
    WHEN 'MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf' THEN 250000
    WHEN 'LEED Credit Guide 7-16-25 (1).pdf' THEN 180000
    ELSE 100000
  END,
  file_size_text = CASE file_name
    WHEN 'Installation Guide - MAXTERRA™ MgO Non-Combustible Single-Layer Subfloor - V 1.02.pdf' THEN '2.5 MB'
    WHEN 'TDS - MAXTERRA® MgO Non-Combustible Single Layer Structural Floor Panels 01-14-25 Version 1.2 Email (1) (1).pdf' THEN '150 KB'
    WHEN 'ESR-5194 - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - June 2024 (4) (1).pdf' THEN '1.8 MB'
    WHEN 'MSDS - MAXTERRA™ MgO Non-Combustible Single Layer Structural Floor Panels - Version 1 Sept 2024.pdf' THEN '250 KB'
    WHEN 'LEED Credit Guide 7-16-25 (1).pdf' THEN '180 KB'
    ELSE '100 KB'
  END
WHERE file_size IS NULL;

-- Make required columns NOT NULL after populating
ALTER TABLE documents ALTER COLUMN name SET NOT NULL;
ALTER TABLE documents ALTER COLUMN storage_path SET NOT NULL;
